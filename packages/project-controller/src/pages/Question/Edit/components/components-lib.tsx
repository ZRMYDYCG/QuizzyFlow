import React from "react"
import { Typography } from "antd"
import { componentConfigGroup } from "../../components/index"

const ComponentsLib: React.FC = () => {
    return (
        <>
            {componentConfigGroup.map((group, index) => {
                return <div key={index} className={index > 0 ? 'mt-[20px]' : ''}>
                    <Typography.Title level={3}>{group.groupName}</Typography.Title>
                </div>
            })}
        </>
    )
}

export default ComponentsLib
