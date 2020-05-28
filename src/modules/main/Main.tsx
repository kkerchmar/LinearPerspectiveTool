import './main.scss';
import { ReactComponent as Hamburger } from './hamburger.svg';
import { ReactComponent as Close } from './close.svg';
import { ReactComponent as LineTool } from './line-tool.svg';
import { ReactComponent as PointTool } from './point-tool.svg';

import React, { FunctionComponent, MouseEvent } from 'react';

import Menu from '../menu/Menu';
import TabControl, { ITab } from '../tabcontrol/TabControl';
import Toolbox, { ITool } from '../toolbox/Toolbox';
import WebGLCanvas from '../webglcanvas/WebGLCanvas';

import useCube from '../hooks/useCube';

interface IMainProps {
}

const Main: FunctionComponent<IMainProps> = (props: IMainProps) => {
    const [isMenuOpen, setIsMenuOpen] = React.useState<boolean>(false);
    
    const tools = React.useMemo<ITool[]>(
        () => [
            {
                name: 'point',
                content: <PointTool/>
            },
            {
                name: 'line',
                content: <LineTool/>
            }
        ],
        null
    );

    const toolMap = React.useMemo<Map<string, ITool>>(
        () => {
            const map = new Map();
            tools.forEach(tool => {
                map.set(tool.name, tool);
            });

            return map;
        },
        null
    );
    
    const [selectedToolName, setSelectedToolName] = React.useState<string>(tools[0].name);

    const contextRef = React.useRef<WebGLRenderingContext>(null);

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
    
    useCube(contextRef);
    
    function toolSelectedCallback(tool: ITool) {
        setSelectedToolName(tool.name);
    }
    
    const tabs: ITab[] = [
        {
            header: 'Basic Tools',
            content: <Toolbox selectedTool={toolMap.get(selectedToolName)}
                              tools={tools}
                              toolSelectedCallback={toolSelectedCallback}/>
        }
    ];

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
                                <TabControl selectedTabIndex={0} tabs={tabs}/>
                            </div>
                            <div className="renderer-container">
                                <WebGLCanvas contextRef={contextRef} />
                            </div>
                        </div>
                    )
                }}
            </Menu>
        </div>
    );
};

export default Main;