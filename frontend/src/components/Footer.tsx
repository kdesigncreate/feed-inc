import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-800 text-white py-16 px-8 lg:px-24">
            <div className="mb-12">
                <Link href="/" className="flex items-center gap-2">
                    <Image 
                        src="/image/logo_feed_white.png" 
                        alt="logo" 
                        width={300} 
                        height={80} 
                        className="w-64 md:w-72" 
                        priority 
                    />
                </Link>
            </div>

            <div className="mb-12">    
        <nav>
          <ul className="flex flex-wrap items-start justify-start space-x-6 leading-8" role="list">
            <li>
              <Link href="/company" className="text-white hover:text-gray-300 transition-colors duration-300">
                Company
              </Link>
            </li>
            <li>
              <Link href="/services" className="text-white hover:text-gray-300 transition-colors duration-300">
                Services
              </Link>
            </li>
            <li>
              <a href="/image/FEED_Cases.pdf" target="_blank" className="text-white hover:text-gray-300 transition-colors duration-300">
                Cases
              </a>
            </li>
            <li>
              <Link href="/knowledge" className="text-white hover:text-gray-300 transition-colors duration-300">
                Knowledge
              </Link>
            </li>
            <li>
              <a 
                href="mailto:contact@feed-inc.com" 
                className="text-white hover:text-gray-300 transition-colors duration-300" 
                aria-label="Send an email to contact@feed-inc.com"
              >
                Contact
              </a>                      
            </li>
          </ul>
        </nav>
      </div> 

      <div className="mb-12">
        <div className="leading-8 break-words">
          株式会社フィード<br />
          〒106-0032 東京都港区六本木4-1-1 <wbr />第二黒崎ビル2F<br />
          <a href="tel:03-3505-3005" className="text-white hover:text-gray-300 transition-colors duration-300">
            Tel：03-3505-3005
          </a><br />
          Fax：03-3505-3004<br />
          代表取締役社長　黒田 毅<br />
          設立　1990年10月
        </div>
      </div>
        
      <div>
        <small className="text-sm">
          &copy; 2024, <Link href="/" title="" className="text-white hover:text-gray-300 transition-colors duration-300">FEED inc.</Link>
        </small>
      </div>
    </footer>
  );
};