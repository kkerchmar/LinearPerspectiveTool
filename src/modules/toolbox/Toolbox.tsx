import './toolbox.scss';

import React, { FunctionComponent, ReactElement, MouseEvent } from 'react';

export interface ITool {
    name: string,
    content: ReactElement
}

interface IToolboxProps {
    tools: ITool[],
    selectedTool: ITool,
    toolSelectedCallback: (tool: ITool) => void
}

const Toolbox: FunctionComponent<IToolboxProps> = props => {
    function onToolClick(event: MouseEvent, tool: ITool) {
        event.preventDefault();

        props.toolSelectedCallback(tool);
    }

    const tools = props.tools.map((tool) => {
        let selected = '';

        if (tool === props.selectedTool) {
            selected = ' selected';
        }

        return (
            <div className={"tool" + selected} key={tool.name} onClick={(event) => onToolClick(event, tool)}>
                {tool.content}
            </div>
        );
    });

    return (
        <div className="toolbox container">
            {tools}
        </div>
    );
};

export default Toolbox;