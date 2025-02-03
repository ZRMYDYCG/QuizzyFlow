import React from'react'
import { Input, Typography } from 'antd'
import { IQuestionInputProps, QuestionInputDefaultData } from "./interface.ts"

const QuestionInput: React.FC<IQuestionInputProps> = (props: IQuestionInputProps) => {
    const { title, placeholder } = { ...QuestionInputDefaultData, ...props }

    return (
        <div>
            <Typography.Paragraph strong>{title}</Typography.Paragraph>
            <div>
                <Input placeholder={placeholder} />
            </div>
        </div>
    )
}

export default QuestionInput