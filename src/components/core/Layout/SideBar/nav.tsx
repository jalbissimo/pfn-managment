import React from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PeopleIcon from '@mui/icons-material/People';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ConstructionIcon from '@mui/icons-material/Construction';
import PaymentsIcon from '@mui/icons-material/Payments';
import BarChartIcon from '@mui/icons-material/BarChart';
import AssessmentIcon from '@mui/icons-material/Assessment';

export type NavItem = {
  id: string;
  text: string;
  href?: string;
  icon: React.ReactNode;
  children?: NavItem[];
};

export const NAV_ITEMS: NavItem[] = [
  { id: 'DASHBOARD', text: 'Dashboard', href: '/dashboard', icon: <DashboardIcon /> },

  { id: 'INCOME', text: 'Venituri', href: '/income', icon: <TrendingUpIcon /> },
  { id: 'EXPENSES', text: 'Cheltuieli', href: '/expenses', icon: <ReceiptLongIcon /> },

  { id: 'EMPLOYEES', text: 'Personal', href: '/employees', icon: <PeopleIcon /> },
  { id: 'TIMESHEETS', text: 'Pontaj', href: '/timesheets', icon: <CalendarMonthIcon /> },

  { id: 'SITES', text: 'Șantiere', href: '/sites', icon: <ConstructionIcon /> },

  {
    id: 'REPORTS',
    text: 'Rapoarte',
    icon: <AssessmentIcon />,
    children: [
      {
        id: 'SITE_PAYROLL',
        text: 'Salarii / șantier',
        href: '/reports/site-payroll',
        icon: <PaymentsIcon />
      },
      {
        id: 'SITE_PROFIT',
        text: 'Profit / șantier',
        href: '/reports/site-profit',
        icon: <BarChartIcon />
      }
    ]
  }
];
