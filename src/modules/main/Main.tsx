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

import useRenderer from '../hooks/useRenderer';

import Model from '../../model/Model';
import Point from '../../model/Point';

interface IModelTool extends ITool {
    action: (point: Point) => void
}

interface IMainProps {
}

const Main: FunctionComponent<IMainProps> = (props: IMainProps) => {
    const [isMenuOpen, setIsMenuOpen] = React.useState<boolean>(false);
    
    const contextRef = React.useRef<WebGLRenderingContext>(null);
    const modelRef = React.useRef<Model>(new Model());

    useRenderer(contextRef, modelRef);

    const tools = React.useRef<IModelTool[]>(
        [
            {
                name: 'point',
                content: <PointTool/>,
                action: point => {
                    if (modelRef.current.isOngoing()) {
                        modelRef.current.cancel();
                    }
                    else {
                        modelRef.current.addPoint(point);
                    }
                }
            },
            {
                name: 'line',
                content: <LineTool/>,
                action: point => {
                    if (modelRef.current.isOngoing()) {
                        modelRef.current.endLine(point);
                    }
                    else {
                        modelRef.current.begin(point);
                    }
                }
            },
            {
                name: 'ray',
                content: <span>ray</span>,
                action: point => {
                    if (modelRef.current.isOngoing()) {
                        modelRef.current.endRay(point);
                    }
                    else {
                        modelRef.current.begin(point);
                    }
                }
            },
            {
                name: 'segment',
                content: <span>segment</span>,
                action: point => {
                    if (modelRef.current.isOngoing()) {
                        modelRef.current.endSegment(point);
                    }
                    else {
                        modelRef.current.begin(point);
                    }
                }
            }
        ]
    );

    function createToolMap(): Map<string, IModelTool> {
        const map = new Map<string, IModelTool>();
        tools.current.forEach(tool => {
            map.set(tool.name, tool);
        });

        return map;
    }

    const toolMap = React.useRef<Map<string, IModelTool>>(createToolMap());
    
    const [selectedToolName, setSelectedToolName] = React.useState<string>(tools.current[0].name);

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
        
    function toolSelectedCallback(tool: ITool) {
        setSelectedToolName(tool.name);
    }
    
    const tabs: ITab[] = [
        {
            header: 'Basic Tools',
            content: <Toolbox selectedTool={toolMap.current.get(selectedToolName)}
                              tools={tools.current}
                              toolSelectedCallback={toolSelectedCallback}/>
        }
    ];

    function rendererClicked(event: MouseEvent) {
        const tool = toolMap.current.get(selectedToolName);
        tool.action(new Point(event.clientX, event.clientY));
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
                                <TabControl selectedTabIndex={0} tabs={tabs}/>
                            </div>
                            <div className="renderer-container" onClick={rendererClicked}>
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