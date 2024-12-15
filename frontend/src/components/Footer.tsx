import * as React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapIcon,
  ShieldCheckIcon,
  BookOpenIcon,
  ArrowUpRightIcon,
  BarChart3,
  Building2,
  BookIcon,
  DollarSignIcon,
  Battery,
  Wind,
  Sun,
  Zap,
  HeadphonesIcon,
  Settings,
  Database,
  LineChart,
  Activity,
  BarChart2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FooterSection {
  title: string;
  icon: React.ElementType;
  links: {
    label: string;
    href: string;
    icon?: React.ElementType;
    isExternal?: boolean;
  }[];
}

const footerSections: FooterSection[] = [
  {
    title: 'Solutions',
    icon: BarChart3,
    links: [
      { label: 'Wind Assets', href: '/solutions/wind', icon: Wind },
      { label: 'Solar Assets', href: '/solutions/solar', icon: Sun },
      { label: 'Hybrid Assets', href: '/solutions/hybrid', icon: Zap },
      { label: 'Energy Storage', href: '/solutions/storage', icon: Battery },
    ],
  },
  {
    title: 'Enterprise',
    icon: Building2,
    links: [
      { label: 'Security & Compliance', href: '/enterprise/security', icon: ShieldCheckIcon },
      { label: 'Custom Integration', href: '/enterprise/integration', icon: Settings },
      { label: 'Deployment Options', href: '/enterprise/deployment', icon: Database },
      { label: '24/7 Support', href: '/enterprise/support', icon: HeadphonesIcon },
    ],
  },
  {
    title: 'Platform',
    icon: Zap,
    links: [
      { label: 'Asset Management', href: '/platform/asset-management', icon: Database },
      { label: 'Performance Analytics', href: '/platform/analytics', icon: LineChart },
      { label: 'Smart Monitoring', href: '/platform/monitoring', icon: Activity },
      { label: 'Reporting & Insights', href: '/platform/reporting', icon: BarChart2 },
    ],
  },
  {
    title: 'Resources',
    icon: BookIcon,
    links: [
      { label: 'Case Studies', href: '/resources/case-studies', icon: BookOpenIcon },
      { label: 'Documentation', href: '/docs', icon: BookOpenIcon, isExternal: true },
      { label: 'White Papers', href: '/resources/white-papers', icon: BookOpenIcon },
      { label: 'Blog', href: '/blog', icon: BookOpenIcon },
    ],
  },
];

const FooterSection: React.FC<{ section: FooterSection }> = ({ section }) => {
  return (
    <div className="space-y-3">
      <div className={cn(
        "flex items-center gap-2",
        "p-2 -ml-2 rounded-lg",
        "group hover:bg-primary/5",
        "transition-colors duration-300"
      )}>
        <section.icon className={cn(
          "h-4 w-4",
          "text-primary/80 group-hover:text-primary",
          "transition-colors duration-300"
        )} />
        <h3 className="font-semibold text-foreground/90">{section.title}</h3>
      </div>
      <ul className="space-y-2">
        {section.links.map((link) => (
          <li key={link.label}>
            <Link
              to={link.href}
              className={cn(
                "group flex items-center gap-2",
                "text-sm text-muted-foreground",
                "hover:text-foreground",
                "transition-colors duration-300"
              )}
            >
              {link.icon && (
                <link.icon className={cn(
                  "h-3.5 w-3.5",
                  "text-muted-foreground/70 group-hover:text-primary/80",
                  "transition-colors duration-300"
                )} />
              )}
              <span className="relative">
                {link.label}
                <span className={cn(
                  "absolute inset-x-0 -bottom-0.5 h-px",
                  "bg-primary/50 scale-x-0 group-hover:scale-x-100",
                  "transition-transform duration-300 origin-left"
                )} />
              </span>
              {link.isExternal && (
                <ArrowUpRightIcon className={cn(
                  "h-3 w-3 opacity-50",
                  "group-hover:opacity-100",
                  "group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
                  "transition-all duration-300"
                )} />
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

const CertificationBadge: React.FC<{ icon: React.ElementType; label: string }> = ({ icon: Icon, label }) => (
  <div className={cn(
    "flex items-center gap-2",
    "px-3 py-1.5 rounded-full",
    "bg-muted/50 hover:bg-muted/70",
    "border border-primary/10 hover:border-primary/20",
    "transition-all duration-300",
    "group cursor-pointer"
  )}>
    <Icon className={cn(
      "h-4 w-4",
      "text-primary/80 group-hover:text-primary",
      "transition-colors duration-300"
    )} />
    <span className={cn(
      "text-sm",
      "text-muted-foreground group-hover:text-foreground/90",
      "transition-colors duration-300"
    )}>
      {label}
    </span>
  </div>
);

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={cn(
      "w-full border-t",
      "bg-muted/30 relative overflow-hidden"
    )}>
      {/* Enhanced background pattern */}
      <div className="absolute inset-0">
        <div className={cn(
          "absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-5",
          "mix-blend-overlay"
        )} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/5" />
      </div>

      <div className="container relative">
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {footerSections.map((section) => (
              <FooterSection 
                key={section.title} 
                section={section}
              />
            ))}
          </div>
        </div>

        <div className={cn(
          "py-6 border-t border-border/50",
          "backdrop-blur-sm"
        )}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-wrap items-center gap-4">
              {['Privacy Policy', 'Terms of Service', 'Security'].map((item, index) => (
                <React.Fragment key={item}>
                  <Link 
                    to={`/${item.toLowerCase().replace(' ', '-')}`}
                    className={cn(
                      "text-sm text-muted-foreground",
                      "hover:text-foreground",
                      "transition-colors duration-300"
                    )}
                  >
                    {item}
                  </Link>
                  {index < 2 && (
                    <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                  )}
                </React.Fragment>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <CertificationBadge icon={MapIcon} label="Global Operations" />
              <CertificationBadge icon={ShieldCheckIcon} label="ISO 27001 Certified" />
              <CertificationBadge icon={BookOpenIcon} label="NERC-CIP Compliant" />
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className={cn(
              "text-sm",
              "bg-gradient-to-r from-primary/70 via-primary/50 to-primary/70",
              "bg-clip-text hover:text-transparent",
              "transition-all duration-500"
            )}>
              &copy; {currentYear} Firmaboard. Enterprise-grade renewable asset intelligence platform.
              <span className="hidden sm:inline"> All rights reserved.</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 