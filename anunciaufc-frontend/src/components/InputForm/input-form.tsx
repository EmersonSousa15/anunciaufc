export interface FormProps {
    label: string;
    id: string;
    type: string;
    children?: React.ReactNode;
    classNameDiv: string;
    classNameInput: string;
    register?: any;
    onInput?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    value?: string;
    readOnly?: boolean;
}

export const InputForm = ({ label, type, id, register, children, classNameDiv, classNameInput, onInput, value, readOnly }: FormProps) => {
    return (
        <>
            <label htmlFor={id} className="p-1">{label}</label>
            <div className={classNameDiv}>
                <input
                    type={type}
                    id={id}
                    className={classNameInput}
                    required
                    readOnly={readOnly ? readOnly : false}
                    {...register ? {...register(id)} : undefined}
                    value = {value ? value : undefined}
                    onChange={onInput ? (e) => onInput(e) : undefined}
                />
                {children}
            </div>
        </>
    )

}