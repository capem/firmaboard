import * as React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuContent,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { navigationMenuTriggerStyle } from '@/components/ui/navigation-menu'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { 
  Menu, 
  Search, 
  Wind, 
  Sun, 
  ArrowRight,
  Building2,
  BarChart3,
  Battery,
  Zap,
  DollarSignIcon,
  BookIcon,
  BookOpenIcon,
  User2,
  Shield,
  Settings,
  HeadphonesIcon,
  Database,
  LineChart,
  Activity,
  BarChart2,
} from 'lucide-react'
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface SolutionItem {
  title: string
  description: string
  icon: React.ElementType
  href: string
}

interface EnterpriseItem extends SolutionItem {}
interface PlatformItem extends SolutionItem {}

const solutionsItems: SolutionItem[] = [
  {
    title: "Solar Assets",
    description: "Advanced monitoring and forecasting for large-scale solar installations",
    icon: Sun,
    href: "/solutions/solar"
  },
  {
    title: "Wind Assets",
    description: "Specialized tools for wind farm management",
    icon: Wind,
    href: "/solutions/wind"
  },
  {
    title: "Hybrid Assets",
    description: "Integrated solutions for combined renewable energy systems",
    icon: Zap,
    href: "/solutions/hybrid"
  },
  {
    title: "Energy Storage",
    description: "Battery and storage system performance optimization",
    icon: Battery,
    href: "/solutions/storage"
  },
]

const enterpriseItems: EnterpriseItem[] = [
  {
    title: "Enterprise Scale",
    description: "Built for utility-scale renewable operations",
    icon: Building2,
    href: "/enterprise/scale"
  },
  {
    title: "Security & Compliance",
    description: "Enterprise-grade security and regulatory compliance",
    icon: Shield,
    href: "/enterprise/security"
  },
  {
    title: "Custom Integration",
    description: "Seamless integration with existing infrastructure",
    icon: Settings,
    href: "/enterprise/integration"
  },
  {
    title: "24/7 Support",
    description: "Dedicated enterprise support and SLAs",
    icon: HeadphonesIcon,
    href: "/enterprise/support"
  },
]

const platformItems: PlatformItem[] = [
  {
    title: "Asset Management",
    description: "Comprehensive renewable asset lifecycle management",
    icon: Database,
    href: "/platform/asset-management"
  },
  {
    title: "Performance Analytics",
    description: "AI-powered performance optimization and forecasting",
    icon: LineChart,
    href: "/platform/analytics"
  },
  {
    title: "Smart Monitoring",
    description: "Real-time monitoring and predictive maintenance",
    icon: Activity,
    href: "/platform/monitoring"
  },
  {
    title: "Reporting & Insights",
    description: "Customizable reports and actionable insights",
    icon: BarChart2,
    href: "/platform/reporting"
  },
]

interface NavItem {
  href: string
  label: string
  description?: string
  hasSubmenu?: boolean
  icon?: React.ElementType
  submenuItems?: SolutionItem[]
}

const navItems: NavItem[] = [
  {
    href: '/solutions',
    label: 'Solutions',
    hasSubmenu: true,
    icon: BarChart3,
    submenuItems: solutionsItems
  },
  {
    href: '/enterprise',
    label: 'Enterprise',
    description: 'Purpose-built for utility-scale operations',
    icon: Building2,
    hasSubmenu: true,
    submenuItems: enterpriseItems
  },
  {
    href: '/features',
    label: 'Platform',
    icon: Zap,
    hasSubmenu: true,
    submenuItems: platformItems
  },
  {
    href: '/resources',
    label: 'Resources',
    hasSubmenu: true,
    icon: BookIcon,
    submenuItems: [
      {
        title: 'Case Studies',
        description: 'Learn how we help businesses like yours',
        icon: BookOpenIcon,
        href: '/resources/case-studies',
      },
      {
        title: 'Documentation',
        description: 'Comprehensive guides and API docs',
        icon: BookOpenIcon,
        href: '/docs',
      },
      {
        title: 'White Papers',
        description: 'In-depth research and analysis',
        icon: BookOpenIcon,
        href: '/resources/white-papers',
      },
      {
        title: 'Blog',
        description: 'Latest news and updates',
        icon: BookOpenIcon,
        href: '/blog',
      },
    ],
  },
  {
    href: '/pricing',
    label: 'Pricing',
    icon: DollarSignIcon,
  },
]

interface NavLinkItemProps extends NavItem {
  isMobile?: boolean
}

const NavLinkItem: React.FC<NavLinkItemProps> = ({ 
  href, 
  label, 
  description, 
  hasSubmenu, 
  submenuItems, 
  icon: Icon, 
  isMobile 
}) => {
  if (hasSubmenu && submenuItems) {
    return (
      <NavigationMenuItem className={cn(
        "w-full",
        isMobile ? "flex flex-col" : "relative group"
      )}>
        <NavigationMenuTrigger 
          className={cn(
            "gap-2 px-4 py-2",
            "data-[state=open]:bg-accent/50",
            isMobile ? "w-full justify-start" : "h-10"
          )}
        >
          {Icon && <Icon className="h-4 w-4" />}
          {label}
        </NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className={cn(
            "grid gap-3 p-6",
            "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80",
            isMobile ? "w-full grid-cols-1" : 
            "w-[400px] md:w-[500px] lg:w-[600px] md:grid-cols-2"
          )}>
            {submenuItems.map((item) => (
              <li key={item.title}>
                <NavigationMenuLink asChild>
                  <Link
                    to={item.href}
                    className={cn(
                      "block select-none space-y-1 rounded-md p-3",
                      "no-underline outline-none",
                      "transition-all duration-200",
                      "hover:bg-accent hover:text-accent-foreground",
                      "focus:bg-accent focus:text-accent-foreground",
                      "group/item"
                    )}
                  >
                    <div className="flex items-center gap-2 text-sm font-medium leading-none">
                      <item.icon className="h-4 w-4 transition-transform group-hover/item:scale-110" />
                      {item.title}
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
                      {item.description}
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
            ))}
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    )
  }

  return (
    <NavigationMenuItem className={cn("w-full", isMobile && "flex flex-col")}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <NavigationMenuLink asChild>
              <Link
                to={href}
                className={cn(
                  navigationMenuTriggerStyle(),
                  "gap-2",
                  isMobile && "w-full justify-start"
                )}
              >
                {Icon && <Icon className="h-4 w-4" />}
                {label}
              </Link>
            </NavigationMenuLink>
          </TooltipTrigger>
          {description && (
            <TooltipContent side="bottom" className="max-w-[300px]">
              <p>{description}</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    </NavigationMenuItem>
  )
}

const NavLinks: React.FC<{ isMobile?: boolean }> = ({ isMobile }) => (
  <NavigationMenu className={cn(
    "w-full",
    isMobile ? "flex flex-col space-y-2" : "px-4"
  )}>
    <NavigationMenuList className={cn(
      "w-full",
      isMobile ? "flex-col space-y-2" : "gap-1"
    )}>
      {navItems.map((item) => (
        <NavLinkItem key={item.href} {...item} isMobile={isMobile} />
      ))}
      
      <div className={cn(
        "flex items-center",
        isMobile ? "flex-col space-y-2 w-full mt-4" : "gap-4 ml-4"
      )}>
        <NavigationMenuItem className={cn("w-full", isMobile && "flex flex-col")}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size={isMobile ? "default" : "icon"}
                  className={cn(
                    "transition-all duration-200",
                    "hover:bg-accent hover:text-accent-foreground",
                    isMobile && "w-full justify-start gap-2"
                  )}
                >
                  <Search className="h-4 w-4" />
                  {isMobile && "Search"}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Search renewable solutions</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </NavigationMenuItem>

        <NavigationMenuItem className={cn("w-full", isMobile && "flex flex-col")}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size={isMobile ? "default" : "sm"}
                  className={cn(
                    "gap-2 group/login relative",
                    "border-primary/20",
                    "hover:border-primary/40",
                    "transition-all duration-300",
                    isMobile && "w-full justify-start"
                  )}
                >
                  <User2 className={cn(
                    "h-4 w-4",
                    "transition-all duration-300",
                    "group-hover/login:scale-110"
                  )} />
                  <span className={cn(
                    "relative",
                    "after:absolute after:bottom-0 after:left-0",
                    "after:w-0 after:h-px after:bg-primary",
                    "after:transition-all after:duration-300",
                    "group-hover/login:after:w-full"
                  )}>
                    Login
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Access your dashboard</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </NavigationMenuItem>

        <NavigationMenuItem className={cn("w-full", isMobile && "flex flex-col")}>
          <Button
            variant="default"
            className={cn(
              "group gap-2 relative overflow-hidden",
              "bg-gradient-to-r from-primary to-primary/90",
              "hover:from-primary/90 hover:to-primary",
              "transition-all duration-300",
              isMobile ? "w-full" : "px-6",
              "after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent after:via-white/20 after:to-transparent",
              "after:translate-x-[-200%] after:hover:translate-x-[200%]",
              "after:transition-transform after:duration-700"
            )}
          >
            Get a Live Demo
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </NavigationMenuItem>
      </div>
    </NavigationMenuList>
  </NavigationMenu>
)

interface NavbarProps {
  className?: string
}

const Navbar: React.FC<NavbarProps> = ({ className }) => {
  const [scrollProgress, setScrollProgress] = React.useState(0)
  const [isScrolled, setIsScrolled] = React.useState(false)
  const location = useLocation()

  React.useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.documentElement.scrollTop
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight
      const scrolled = (winScroll / height) * 100
      setScrollProgress(scrolled)
      setIsScrolled(winScroll > 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={cn(
      "sticky top-0 w-full border-b",
      "backdrop-blur-md transition-all duration-200",
      "z-50 h-16",
      isScrolled 
        ? "bg-background/95 supports-[backdrop-filter]:bg-background/60 shadow-sm" 
        : "bg-background/50",
      className
    )}>
      {location.pathname === '/' && (
        <div className="absolute bottom-0 left-0 h-[2px] w-full bg-muted">
          <div 
            className={cn(
              "h-full bg-gradient-to-r from-primary to-primary/80",
              "transition-all duration-200"
            )}
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      )}

      <nav className="container h-16">
        <div className="flex h-full items-center justify-between gap-4">
          <Link
            to="/"
            className={cn(
              "text-lg font-semibold text-foreground",
              "flex items-center gap-2 group"
            )}
          >
            <div className="relative w-6 h-6">
              <Wind className={cn(
                "h-6 w-6 absolute",
                "transition-all duration-500",
                "opacity-100 group-hover:opacity-0 group-hover:rotate-180"
              )} />
              <Sun className={cn(
                "h-6 w-6 absolute",
                "transition-all duration-500",
                "opacity-0 group-hover:opacity-100 group-hover:rotate-180"
              )} />
            </div>
            <span className="hidden sm:inline">Firmaboard</span>
          </Link>

          <div className="hidden md:flex flex-1 justify-center">
            <NavLinks />
          </div>

          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button 
                variant="ghost" 
                size="icon"
                className="transition-transform active:scale-95"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col gap-6 mt-6">
                <Link
                  to="/"
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <Wind className="h-5 w-5" />
                  Firmaboard
                </Link>
                <NavLinks isMobile />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}

export default Navbar