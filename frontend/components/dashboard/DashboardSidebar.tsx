"use client";

import React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  DollarSign,
  Calendar,
  CheckSquare,
  LogOut,
  Settings,
  ChevronsUpDown,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { UserSession, WeddingSummary } from "@/types/dashboard";
import { calculateDaysRemaining } from "@/lib/dashboard-utils";
import { useAuth } from "@/hooks/use-auth";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuBadge,
  SidebarSeparator,
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardSidebarProps {
  user: UserSession;
  wedding: WeddingSummary;
  activeTab: string;
  onTabChange: (tab: string) => void;
  totalEvents?: number;
  checklistProgress?: string;
}

export function DashboardSidebar({
  user,
  wedding,
  activeTab,
  onTabChange,
  totalEvents = 3,
  checklistProgress = "2/5",
  ...props
}: DashboardSidebarProps & React.ComponentProps<typeof Sidebar>) {
  const { logout } = useAuth();
  const daysRemaining = calculateDaysRemaining(wedding.weddingDate);

  const mainNavItems = [
    {
      id: "overview",
      label: "Ringkasan",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: "guests",
      label: "Tamu & RSVP",
      icon: Users,
      badge: "350",
    },
    {
      id: "budget",
      label: "Anggaran",
      icon: DollarSign,
      badge: "64%",
    },
    {
      id: "schedule",
      label: "Jadwal & Acara",
      icon: Calendar,
      badge: `${totalEvents} Sesi`,
    },
    {
      id: "checklist",
      label: "Checklist",
      icon: CheckSquare,
      badge: checklistProgress,
    },
  ];

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-champagne-light/60 [&_[data-sidebar=sidebar]]:bg-ivory-50 [&_[data-sidebar=sidebar]]:text-charcoal-800"
      {...props}
    >
      <SidebarHeader className="px-5 pt-6 pb-4 group-data-[collapsible=icon]:px-2">
        <Link href="/dashboard" className="flex items-center gap-3 group/logo">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-champagne-light via-champagne to-champagne-dark text-white font-cormorant text-2xl font-bold shadow-md ring-1 ring-champagne-dark/20 transition-transform duration-300 group-hover/logo:scale-105 group-hover/logo:rotate-3 group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:text-lg">
            J
          </div>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <span className="block font-cormorant text-2xl font-semibold uppercase leading-none tracking-[0.16em] text-charcoal-900">
              JadiSah.
            </span>
            <span className="mt-1 block text-[10px] uppercase tracking-[0.25em] text-champagne-dark">
              Wedding Atelier
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarSeparator className="mx-5 bg-champagne-light/60 group-data-[collapsible=icon]:mx-2" />

      <SidebarContent className="px-3 pt-2 group-data-[collapsible=icon]:px-1">
        {/* Atelier Card (Only visible when expanded) */}
        <div className="mx-2 mb-4 mt-2 group-data-[collapsible=icon]:hidden rounded-2xl border border-champagne-light bg-champagne-soft/30 p-4 soft-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-semibold tracking-[0.15em] text-champagne-dark uppercase">
              Atelier Pernikahan
            </span>
            <span className="rounded-full border border-champagne-light bg-white px-2 py-0.5 text-[9px] font-medium text-charcoal-700">
              owner
            </span>
          </div>
          <h3 className="font-cormorant text-lg font-bold text-charcoal-900 leading-tight">
            {wedding.brideName} &amp; {wedding.groomName}
          </h3>
          <p className="mt-1 font-serif text-xs italic text-charcoal-500">
            {new Date(wedding.weddingDate).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
          <div className="mt-3 flex items-center gap-2 text-xs text-charcoal-700 font-medium">
            <span className="size-2 rounded-full bg-sage-dark animate-pulse" />
            <span>{daysRemaining} hari menuju hari-H</span>
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-semibold uppercase tracking-[0.2em] text-charcoal-500">
            Concierge Portal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    tooltip={item.label}
                    isActive={activeTab === item.id}
                    onClick={() => onTabChange(item.id)}
                    className="relative h-10 rounded-lg px-3 text-sm text-charcoal-700 transition-all duration-200 hover:bg-champagne/15 hover:text-charcoal-900 data-[active=true]:bg-gradient-to-r data-[active=true]:from-champagne/30 data-[active=true]:to-champagne/5 data-[active=true]:font-semibold data-[active=true]:text-charcoal-900 data-[active=true]:shadow-xs data-[active=true]:before:absolute data-[active=true]:before:left-0 data-[active=true]:before:top-2 data-[active=true]:before:bottom-2 data-[active=true]:before:w-[3px] data-[active=true]:before:rounded-full data-[active=true]:before:bg-champagne-dark [&>svg]:text-champagne-dark"
                  >
                    <item.icon className="size-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                  {item.badge && (
                    <SidebarMenuBadge className="top-2.5 rounded-full border border-champagne-light/70 bg-white/70 px-2 text-[10px] font-medium text-charcoal-600">
                      {item.badge}
                    </SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="mx-5 my-2 bg-champagne-light/60 group-data-[collapsible=icon]:mx-2" />

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-semibold uppercase tracking-[0.2em] text-charcoal-500">
            Tautan Cepat
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Undangan Publik"
                  className="relative h-10 rounded-lg px-3 text-sm text-charcoal-700 transition-all duration-200 hover:bg-champagne/15 hover:text-charcoal-900"
                >
                  <ExternalLink className="size-4" />
                  <span>Undangan Publik</span>
                  <ChevronRight className="ml-auto size-4 text-charcoal-400 group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Pengaturan Acara"
                  className="relative h-10 rounded-lg px-3 text-sm text-charcoal-700 transition-all duration-200 hover:bg-champagne/15 hover:text-charcoal-900"
                >
                  <Settings className="size-4" />
                  <span>Pengaturan Acara</span>
                  <ChevronRight className="ml-auto size-4 text-charcoal-400 group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 group-data-[collapsible=icon]:p-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              tooltip={user.fullName}
              className="h-auto w-full rounded-xl border border-champagne-light/60 bg-white/60 px-3 py-2.5 text-charcoal-800 shadow-xs transition-all hover:border-champagne hover:bg-white data-[state=open]:border-champagne data-[state=open]:bg-white group-data-[collapsible=icon]:border-transparent group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:shadow-none"
            >
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-champagne to-champagne-dark font-cormorant text-base font-bold text-white group-data-[collapsible=icon]:size-8">
                {user.fullName?.charAt(0).toUpperCase() ?? <Users className="size-4" />}
              </div>
              <div className="flex min-w-0 flex-1 flex-col items-start gap-1 text-left group-data-[collapsible=icon]:hidden">
                <span className="w-full truncate text-sm font-semibold leading-tight text-charcoal-900">
                  {user.fullName}
                </span>
                <span className="w-full truncate text-xs leading-tight text-champagne-dark">
                  H - {daysRemaining} Hari
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4 shrink-0 text-charcoal-500 group-data-[collapsible=icon]:hidden" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" sideOffset={8} className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-xl border-champagne-light bg-ivory-50">
            <DropdownMenuItem className="hover:bg-champagne/20 cursor-pointer text-charcoal-800">
              <Settings className="mr-2 size-4" />
              <span>Pengaturan</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-champagne-light/50" />
            <DropdownMenuItem 
              onClick={logout}
              className="text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer"
            >
              <LogOut className="mr-2 size-4" />
              <span>Keluar</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
