import * as React from 'react';
import { ReactElement } from 'react';
import styles from "../ui/dashboard/dashboard.module.css";
import { Navbar } from '../ui/dashboard/navbar/navbar';
import { Sidebar } from '../ui/dashboard/sidebar/sidebar';

export interface IDashboardLayoutProps {
  children: ReactElement;
}

export default function DashboardLayout ({ children }: IDashboardLayoutProps) {
  return (
    <div className={styles.container}>
    <div className={styles.menu}>
      <Sidebar />
    </div>
    <div className={styles.content}>
      <Navbar />
      {children}
    </div>
    </div>
  );
}
