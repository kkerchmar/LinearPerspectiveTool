import './tabcontrol.scss';

import React, { FunctionComponent, ReactElement, MouseEvent } from 'react';

export interface ITab {
    header: string,
    content: ReactElement
}

export interface ITabControlProps {
    selectedTabIndex: number,
    tabs: ITab[]
}

const TabControl: FunctionComponent<ITabControlProps> = props => {
    const [selectedTabIndex, setSelectedTabIndex] = React.useState<number>(props.selectedTabIndex);

    function onTabClick(event: MouseEvent, tabIndex: number) {
        event.preventDefault();
        setSelectedTabIndex(tabIndex);
    }

    const tabs = props.tabs.map((tab, index) => {
        let selected = '';
        if (index === selectedTabIndex) {
            selected = ' selected';
        }

        return (
            <div className={"tab" + selected} key={index} onClick={(event) => onTabClick(event, index)}>
                <span>{tab.header}</span>
            </div>
        );
    });

    return (
        <div className="tabcontrol container">
            <div className="content container">
                {props.tabs[selectedTabIndex].content}
            </div>
            <div className="tabs">
                {tabs}
            </div>
        </div>
    );
};

export default TabControl;