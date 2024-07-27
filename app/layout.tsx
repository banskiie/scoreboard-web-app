import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "C-ONE Badminton Challenge",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster
          richColors
          theme="light"
          expand
          visibleToasts={5}
          closeButton
          pauseWhenPageIsHidden={true}
        />
      </body>
    </html>
  )
}
