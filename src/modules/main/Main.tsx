import './main.scss';
import { ReactComponent as Hamburger} from './hamburger.svg';
import { ReactComponent as Close } from './close.svg';

import React, { FunctionComponent, MouseEvent } from 'react';

import Menu from '../menu/Menu';
import Renderer from '../renderer/Renderer';

interface IMainProps {
}

const Main: FunctionComponent<IMainProps> = (props: IMainProps) => {
    const [isMenuOpen, setIsMenuOpen] = React.useState<boolean>(false);

    function closeMenu(event: MouseEvent) {
        event.preventDefault();
        setIsMenuOpen(false);
    }
    
    function openMenu(event: MouseEvent) {
        event.preventDefault();
        setIsMenuOpen(true);
    }
    
    function closeMenuCapture() {
        setIsMenuOpen(false);
    }
    
    return (
        <div className="container">
            <Menu isOpen={isMenuOpen}>
                {{
                    menu: (
                        <div className="container menu-content">
                            <div className="hover-frame">
                                <Close className="close icon-button" onClick={closeMenu}/>
                            </div>
                        </div>
                    ),
                    content: (
                        <div className="main-grid container" onClickCapture={closeMenuCapture}>
                            <header>
                                {!isMenuOpen && (
                                    <div className="hover-frame">
                                        <Hamburger className="hamburger icon-button" onClick={openMenu}/>
                                    </div>
                                )}
                                <h1>Linear Perspective Tool</h1>
                            </header>
                            <div className="sidebar-container">
                                <h1>Sidebar Container</h1>
                            </div>
                            <div className="renderer-container">
                                <Renderer />
                            </div>
                        </div>
                    )
                }}
            </Menu>
        </div>
    );
};

export default Main;