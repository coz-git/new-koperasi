/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import Link from 'next/link';
import { AppMenuItem } from '../types/types';

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const token = localStorage.getItem('role');
    const token2 = localStorage.getItem('status');
    if (token2 == "inactive") {
        const model: AppMenuItem[] = [
            {
                label: 'Home',
                items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
            },
        ];
        return (
            <MenuProvider>
                <ul className="layout-menu">
                    {model.map((item, i) => {
                        return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                    })}

                    {/* <Link href="https://blocks.primereact.org" target="_blank" style={{ cursor: 'pointer' }}>
                        <img alt="Prime Blocks" className="w-full mt-3" src={`/layout/images/banner-primeblocks${layoutConfig.colorScheme === 'light' ? '' : '-dark'}.png`} />
                    </Link> */}
                </ul>
            </MenuProvider>
        );
    } else {
        if (token == "Admin") {
            const model: AppMenuItem[] = [
                {
                    label: 'Home',
                    items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
                },
                {
                    label: 'Master Data',
                    items: [
                        { label: 'Master User', icon: 'pi pi-fw pi-user', to: '/admin/master_user' },
                        { label: 'Master Jenis Simpan', icon: 'pi pi-fw pi-bookmark', to: '/admin/master_simpan' },
                        { label: 'Master Jenis Pinjam', icon: 'pi pi-fw pi-exclamation-circle', to: '/admin/master_pinjam' },
                        { label: 'Master Bank', icon: 'pi pi-fw pi-exclamation-circle', to: '/admin/master_bank' },
                    ]
                },
                {
                    label: 'Menu Transaksi',
                    items: [
                        { label: 'Transaksi Pinjam', icon: 'pi pi-fw pi-mobile', to: '/admin/transaksi_pinjam', class: 'rotated-icon' },
                        { label: 'Transaksi Simpan', icon: 'pi pi-fw pi-table', to: '/admin/transaksi_simpan' },
                        { label: 'Transaksi Pembayaran', icon: 'pi pi-fw pi-table', to: '/admin/transaksi_pembayaran' },
                    ]
                },
                {
                    label: 'Menu Report',
                    items: [
                        { label: 'Report user', icon: 'pi pi-fw pi-list', to: '/admin/report_user' },
                        { label: 'Report Payment', icon: 'pi pi-fw pi-book', to: '/admin/report_payment' },
                        { label: 'Report Simpan', icon: 'pi pi-fw pi-share-alt', to: '/admin/report_simpan' },
                        { label: 'Report Pinjaman', icon: 'pi pi-fw pi-tablet', to: '/admin/report_pinjam' },

                    ]
                },

            ];
            return (
                <MenuProvider>
                    <ul className="layout-menu">
                        {model.map((item, i) => {
                            return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                        })}

                        {/* <Link href="https://blocks.primereact.org" target="_blank" style={{ cursor: 'pointer' }}>
                            <img alt="Prime Blocks" className="w-full mt-3" src={`/layout/images/banner-primeblocks${layoutConfig.colorScheme === 'light' ? '' : '-dark'}.png`} />
                        </Link> */}
                    </ul>
                </MenuProvider>
            );
        } else {
            const model: AppMenuItem[] = [
                {
                    label: 'Home',
                    items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
                },
                {
                    label: 'UI Components',
                    items: [
                        { label: 'History Simpan', icon: 'pi pi-fw pi-id-card', to: '/client/history_simpan' },
                        { label: 'Pengajuan Pinjaman', icon: 'pi pi-fw pi-check-square', to: '/client/pengajuan_pinjaman' },
                        { label: 'Pembayaran', icon: 'pi pi-fw pi-bookmark', to: '/client/pembayaran' },
                        { label: 'Report Pinjaman', icon: 'pi pi-fw pi-exclamation-circle', to: '/client/report_pinjaman' },
                    ]
                },

            ];
            return (
                <MenuProvider>
                    <ul className="layout-menu">
                        {model.map((item, i) => {
                            return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                        })}

                        {/* <Link href="https://blocks.primereact.org" target="_blank" style={{ cursor: 'pointer' }}>
                            <img alt="Prime Blocks" className="w-full mt-3" src={`/layout/images/banner-primeblocks${layoutConfig.colorScheme === 'light' ? '' : '-dark'}.png`} />
                        </Link> */}
                    </ul>
                </MenuProvider>
            );
        }
    }


};

export default AppMenu;
