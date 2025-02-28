 

export function ServerTranslate(props: { message: string }) {     
    return <span className="vt-msg" data-id={props.message}>{I18n.t(props.message)}</span>
}   