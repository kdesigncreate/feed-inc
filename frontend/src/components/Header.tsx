'use client'

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export const Header: React.FC = () => {
    //HeaderはHeaderのコンポーネント。
    //React.FCはReactの関数コンポーネントにするためのもの。
    //引数はなし。
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    //初期状態はどちもfalse
    //useStateはuseStateのコンポーネント。
    //useStateは初期状態を設定するためのもの。
    //isMenuOpenはメニューが開いているかどうかを表す。
    //setIsMenuOpenはisMenuOpenの状態を変更するためのもの。

    const toggleMenu = () => {
        //toggleMenuはメニューを開閉するための関数。
        setIsMenuOpen(!isMenuOpen);
        //isMenuOpenの状態を反転させる（クリックするたびに開閉が変わる）
    };

    const closeMenu = () => {
        //closeMenuはメニューを閉じるための関数。
        setIsMenuOpen(false);
        //isMenuOpenの状態をfalseにする
    };

    useEffect(() => {
        //useEffectは副作用を実行するためのもの。
        //副作用とは、コンポーネントの外側の状態を変更すること。（ここではメニューを開閉する。）
        const handleEscKey = (event: KeyboardEvent) => {
            //handleEscKeyはESCキーが押された時の処理を表す。
            //eventはキーボードイベントを表す。
            //KeyboardEventはキーボードイベントを表す。
            if (event.key === 'Escape') {
                //event.key === 'Escape'の場合はif文の中に入る。
                closeMenu();
                //closeMenuはメニューを閉じるための関数。
            }
        };

        if (isMenuOpen) {
            //isMenuOpenがtrueの場合はif文の中に入る。
            document.addEventListener('keydown', handleEscKey);
            //handleEscKeyをdocument.addEventListenerで監視するためのもの。
            //keydownはキーボードイベントを表す。
            document.body.style.overflow = 'hidden';
            //document.bodyのstyle.overflowを'hidden'にする。
        }

        return () => {
            document.removeEventListener('keydown', handleEscKey);
            //handleEscKeyをdocument.removeEventListenerで監視するためのもの。
            document.body.style.overflow = '';
            //document.bodyのstyle.overflowを''にする。
        };
    },[isMenuOpen]);
    //[isMenuOpen]は依存配列を表す。
    //依存配列とは、useEffectが実行されるタイミングを決定するためのもの。
    //isMenuOpenが変更されたら、useEffectが実行される。

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