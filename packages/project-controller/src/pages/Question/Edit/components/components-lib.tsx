import React from "react"
import { Typography } from "antd"
import { componentConfigGroup } from "../../components/index"
import { ComponentConfigType } from "../../components/index"

function gennerateComponent(c: ComponentConfigType) {
    const { title, type, component: Component } = c

    return <div>
        <Component />
    </div>
}

const ComponentsLib: React.FC = () => {
    return (
        <>
            {componentConfigGroup.map((group, index) => {
                const { groupName, components } = group
                return <div key={index} className={
                    index > 0 ? 'mt-[20px]' : ''
                }>
                    <Typography.Title level={3}>{groupName}</Typography.Title>
                    <div key={index}>{components.map((component, index) => gennerateComponent(component))}</div>
                </div>
            })}
        </>
    )
}

export default ComponentsLib
