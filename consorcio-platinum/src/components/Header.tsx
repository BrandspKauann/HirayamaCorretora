import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { useNavigate, useLocation } from "react-router-dom";
import { LeadFormModal } from "./LeadFormModal";
import { SimulacaoConsorcioModal } from "./SimulacaoConsorcioModal";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showSimulacao, setShowSimulacao] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const whatsappLink = "https://wa.link/3gwhbl";

  const menuItems: Array<{ label: string; href: string; type: "route" | "anchor" }> = [
    { label: "Início", href: "/", type: "route" },
    { label: "Consórcio Platinum", href: "/", type: "route" },
    { label: "Blog", href: "/conteudo", type: "route" },
    { label: "Tipos", href: "#tipos", type: "anchor" },
    { label: "Processo", href: "#processo", type: "anchor" },
    { label: "Contato", href: "#cta", type: "anchor" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavigation = (item: (typeof menuItems)[number]) => {
    if (item.type === "route") {
      if (item.href === "/") {
        navigate(item.href);
      } else {
        navigate(item.href);
      }
      setIsMenuOpen(false);
      return;
    }
    if (item.type === "anchor") {
      if (location.pathname !== "/") {
        window.location.href = "/consorcio/" + item.href;
      } else {
        const element = document.querySelector(item.href);
        if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      setIsMenuOpen(false);
    }
  };

  return (
    <header
      className={`w-full bg-white dark:bg-background border-b border-border/50 fixed top-0 z-50 transition-all duration-500 ${
        isScrolled ? "shadow-lg shadow-primary/5" : "shadow-sm"
      }`}
    >
      <div className="container mx-auto px-3 sm:px-4 py-2.5 sm:py-3 md:py-4">
        <div className="flex items-center justify-between md:justify-between relative">
          <div className="flex-1 flex justify-center md:justify-start md:flex-initial">
            <a href="/consorcio/" className="flex items-center gap-2 sm:gap-3 group">
              <div className="inline-flex flex-col items-end leading-none">
                <span className="text-base sm:text-lg md:text-xl whitespace-nowrap group-hover:opacity-90 transition-all">
                  <span className="font-light bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent">
                    Consórcio{" "}
                  </span>
                  <span className="font-bold bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent">
                    Platinum
                  </span>
                </span>
                <span className="text-[9px] sm:text-[10px] font-medium text-muted-foreground tracking-wide -mt-0.5">
                  By Hirayama
                </span>
              </div>
            </a>
          </div>

          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {menuItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavigation(item)}
                className="px-3 lg:px-4 py-2 lg:py-2.5 text-xs lg:text-sm xl:text-base text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-300 font-medium relative group"
              >
                <span className="relative z-10">{item.label}</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowForm(true)}
              className="hidden md:flex text-sm lg:text-base px-4 lg:px-6 py-2 lg:py-2.5 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all"
            >
              Simulação
            </Button>

            <Button
              size="lg"
              className="hidden md:flex text-sm lg:text-base px-4 lg:px-6 py-2 lg:py-2.5 bg-primary text-primary-foreground hover:bg-primary-hover shadow-md transition-all"
              onClick={() => setShowSimulacao(true)}
            >
              WhatsApp
            </Button>

            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[320px]">
                <SheetHeader>
                  <SheetTitle className="text-left font-normal leading-tight">
                    <span className="inline-flex flex-col items-end leading-none">
                      <span className="text-lg sm:text-xl text-primary whitespace-nowrap">
                        <span className="font-light">Consórcio </span>
                        <span className="font-bold">Platinum</span>
                      </span>
                      <span className="text-[10px] font-medium text-muted-foreground tracking-wide -mt-0.5">
                        By Hirayama
                      </span>
                    </span>
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-2 mt-6 sm:mt-8">
                  {menuItems.map((item) => (
                    <button
                      key={item.href}
                      onClick={() => handleNavigation(item)}
                      className="text-left px-4 py-2.5 sm:py-3 text-sm sm:text-base text-foreground/80 hover:text-primary hover:bg-muted rounded-lg transition-all duration-200 font-medium"
                    >
                      {item.label}
                    </button>
                  ))}
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setShowForm(true);
                    }}
                    className="mt-4 w-full text-sm sm:text-base px-4 py-2.5 sm:py-3 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    Simulação
                  </Button>
                  <Button
                    size="lg"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setShowSimulacao(true);
                    }}
                    className="mt-2 w-full text-sm sm:text-base px-4 py-2.5 sm:py-3 bg-primary text-primary-foreground hover:bg-primary-hover"
                  >
                    WhatsApp
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <SimulacaoConsorcioModal open={showSimulacao} onOpenChange={setShowSimulacao} />
      <LeadFormModal
        open={showForm}
        onOpenChange={setShowForm}
        title="Solicitar simulação"
        description="Preencha o formulário e entraremos em contato para apresentar as melhores opções de consórcio."
        origem="header"
      />
    </header>
  );
};

export default Header;
