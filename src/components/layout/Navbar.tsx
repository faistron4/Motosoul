import Link from "next/link";

const links = [
  { href: "/features", label: "Features" },
  { href: "/guides", label: "Guides" },
  { href: "/circuits", label: "Circuits" },
  { href: "/tools", label: "Tools" },
];

export default function Navbar() {
  return (
    <nav>
      <ul>
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
