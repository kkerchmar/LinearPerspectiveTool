import './menu.scss';

import React, { Component, ReactNode } from 'react';

interface IMenuProps {
    isOpen: boolean,
    children: {
        menu: ReactNode,
        content: ReactNode
    } 
}

interface IMenuState {
}

export default class Menu extends Component<IMenuProps, IMenuState> {
    constructor(props: IMenuProps) {
        super(props);
    }

    render() {
        let openStyle: string = '';
        if (this.props.isOpen) {
            // The whitespace here is necessary to separate it from the
            // preceding CSS class name.
            openStyle = ' menu-open';
        }

        return (
            <div className="menu-component">
                <div className={"menu" + openStyle}>
                    {this.props.children.menu}
                </div>
                <div className={"content" + openStyle}>
                    {this.props.children.content}
                </div>
            </div>
        );
    }
}