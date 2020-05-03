import './menu.scss';

import React, { FunctionComponent, ReactNode } from 'react';

interface IMenuProps {
    isOpen: boolean,
    children: {
        menu: ReactNode,
        content: ReactNode
    } 
}

const Menu: FunctionComponent<IMenuProps> = (props: IMenuProps) => {
    let openStyle: string = '';
    if (props.isOpen) {
        // The whitespace here is necessary to separate it from the
        // preceding CSS class name.
        openStyle = ' menu-open';
    }

    return (
        <div className="menu-component">
            <div className={"menu" + openStyle}>
                {props.children.menu}
            </div>
            <div className={"content" + openStyle}>
                {props.children.content}
            </div>
        </div>
    );
};

export default Menu;