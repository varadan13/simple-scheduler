import "./globals.css";

export const metadata = {
  title: "ENFIN MACHINE ROUND",
  description: "Enfin Machine Round",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white">{children}</body>
    </html>
  );
}
