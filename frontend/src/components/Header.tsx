'use client'

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    //初期状態はどちらもfalse

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    //isMenuOpenの状態を反転させる（クリックするたびに開閉が変わる）

    const closeMenu = () => {
        setIsMenuOpen(false);
    };
    //常にfalseにする

    useEffect(() => {
        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                closeMenu();
            }
        };
        //Escキーが押されていれば、closeMenu 関数を呼び出し、メニューを閉じる

        if (isMenuOpen) {
            document.addEventListener('keydown', handleEscKey);
            document.body.style.overflow = 'hidden';
        }
        //メニューが開いていれば、keydown イベントを追加し、ボディのスクロールを無効化する

        return () => {
            document.removeEventListener('keydown', handleEscKey);
            document.body.style.overflow = '';
        };
        //メニューが閉じたら、keydown イベントを削除し、ボディのスクロールを有効化する
    },[isMenuOpen]);

    return (
        <header className="w-full p-4 flex justify-between items-center fixed top-0 left-0 text-white bg-transparent z-40">
            <div className="w-full flex justify-between items-center">
                <h1 className="flex items-center">
                    <Link href="/" onClick={closeMenu}>
                        <Image 
                            src="/image/logo_feed.png"
                            alt="logo"
                            width={250} 
                            height={60} 
                            className="w-48 md:w-60"
                            priority
                        />
                    </Link>
                </h1>
                <div className="flex items-center z-50">
                    <button
                        className="w-8 h-8 flex items-center justify-center relative"
                        onClick={toggleMenu}
                        aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={isMenuOpen}
                        type="button"
                    >
                        <span
                            className={`w-6 h-0.5 absolute rounded ${isMenuOpen ? 'top-4' : 'top-2'} ${isMenuOpen ? 'bg-white' : 'bg-black'} ${isMenuOpen ? 'rotate-45' : ''} transition-all duration-300 ease-in-out`}
                        />
                        <span
                            className={`w-6 h-0.5 absolute rounded top-4 ${isMenuOpen ? 'bg-white' : 'bg-black'} ${isMenuOpen ? 'opacity-0' : ''} transition-all duration-300 ease-in-out`}
                        />
                        <span
                            className={`w-6 h-0.5 absolute rounded ${isMenuOpen ? 'top-4' : 'top-6'} ${isMenuOpen ? 'bg-white' : 'bg-black'} ${isMenuOpen ? '-rotate-45' : ''} transition-all duration-300 ease-in-out`}
                        />
                    </button>
                </div>
            </div>

            {isMenuOpen &&(
                <div className="fixed inset-0 z-30 bg-black/50" onClick={closeMenu} aria-hidden="true"></div>
            )}

            <nav 
                className={`w-full max-w-xs h-full p-4 flex flex-col justify-center items-center fixed top-0 right-0 z-40 bg-black/80 transform ${
                    isMenuOpen ? 'translate-x-0' : 'translate-x-full'
                } transition-transform duration-300 ease-in-out`}
                role="navigation"
                aria-label="Main navigation"
            >
                <ul className="w-full flex flex-col gap-8 items-center justify-center">
                    <li>
                        <Link href="/" onClick={closeMenu} className="text-xl text-white">Home</Link>
                    </li>
                    <li>
                        <Link href="/company" onClick={closeMenu} className="text-xl text-white">Company</Link>
                    </li>
                    <li>
                        <Link href="/services" onClick={closeMenu} className="text-xl text-white">Services</Link>
                    </li>
                    <li>
                        <a href="/image/FEED_Cases.pdf" target="_blank" onClick={closeMenu} className="text-xl text-white">Cases</a>
                    </li>
                    <li>
                        <Link href="/knowledge" onClick={closeMenu} className="text-xl text-white">Knowledge</Link>
                    </li>
                    <li>
                        <Link href="mailto:contact@feed-inc.com" onClick={closeMenu} className="text-xl text-white">Contact</Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
}