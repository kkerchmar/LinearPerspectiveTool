import './main.scss';
import { ReactComponent as Hamburger} from './hamburger.svg';
import { ReactComponent as Close } from './close.svg';

import React, { Component, MouseEvent } from 'react';

import Menu from '../menu/Menu';

interface IMainProps {
}

interface IMainState {
    isMenuOpen: boolean
}

export default class Main extends Component<IMainProps, IMainState> {
    constructor(props: IMainProps) {
        super(props);

        this.state = { isMenuOpen: false };

        this.closeMenu = this.closeMenu.bind(this);
        this.openMenu = this.openMenu.bind(this);
        this.closeMenuCapture = this.closeMenuCapture.bind(this);
    }

    render() {
        return (
            <div className="container">
                <Menu isOpen={this.state.isMenuOpen}>
                    {{
                        menu: (
                            <div className="container menu-content">
                                <div className="hover-frame">
                                    <Close className="close icon-button" onClick={this.closeMenu}/>
                                </div>
                            </div>
                        ),
                        content: (
                            <div className="main-grid container" onClickCapture={this.closeMenuCapture}>
                                <header>
                                    {!this.state.isMenuOpen && (
                                        <div className="hover-frame">
                                            <Hamburger className="hamburger icon-button" onClick={this.openMenu}/>
                                        </div>
                                    )}
                                    <h1>Linear Perspective Tool</h1>
                                </header>
                                <div className="sidebar">
                                    <h1>Sidebar Container</h1>
                                </div>
                                <div className="render">
                                    <h1>Render Container</h1>
                                </div>
                            </div>
                        )
                    }}
                </Menu>
            </div>
        );
    }

    private closeMenu(event: MouseEvent) {
        event.preventDefault();
        this.setState({ isMenuOpen: false });
    }

    private openMenu(event: MouseEvent) {
        event.preventDefault();
        this.setState({ isMenuOpen: true });
    }

    private closeMenuCapture(event: MouseEvent) {
        this.setState({ isMenuOpen: false });
    }
}