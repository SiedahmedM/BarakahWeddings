import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from 'bcryptjs'
import { prisma } from "./prisma"

interface UserWithVendor {
  id: string
  email: string
  name?: string | null
  vendor?: {
    id: string
    businessName: string
    verified: boolean
    verificationStatus: string
  } | null
}

export const authOptions: NextAuthOptions = {
  adapter: prisma ? PrismaAdapter(prisma) : undefined,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Return null if no database connection
        if (!prisma) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          },
          include: {
            vendor: true
          }
        })

        if (!user || !user.password) {
          return null
        }

        // Verify the password
        const isValidPassword = await bcrypt.compare(credentials.password, user.password)
        if (!isValidPassword) {
          return null
        }
        
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          vendor: user.vendor
        } as UserWithVendor
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.vendor = (user as UserWithVendor).vendor
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.sub!
        ;(session.user as any).vendor = token.vendor
      }
      return session
    }
  },
  pages: {
    signIn: "/vendor/login"
  }
}