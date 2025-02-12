import React from "react";
import { Typography } from "antd";
import { componentConfigGroup } from "../../components/index";
import { ComponentConfigType } from "../../components/index";
import { cn } from "../../../../utils/index";

function generateComponent(c: ComponentConfigType) {
    const { title, type, component: Component } = c;

    return (
        <div className={cn('mb-[12px] cursor-pointer bg-[#fff] border-[1px] border-[#fff] hover:border-[#e5e5e5] rounded-[4px] p-[12px]')}>
            <div className="pointer-events-none">
                <Component />
            </div>
        </div>
    );
}

const ComponentsLib: React.FC = () => {
    return (
        <div>
            {componentConfigGroup.map((group, index) => {
                const { groupName, components } = group;
                return (
                    <div key={index} className={cn(index > 0 && 'mt-[20px]')}>
                        <Typography.Title level={3}>{groupName}</Typography.Title>
                        {components.map(generateComponent)}
                    </div>
                );
            })}
        </div>
    );
}

export default ComponentsLib;
