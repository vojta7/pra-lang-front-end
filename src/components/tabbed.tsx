import React, {ReactNode, useState} from 'react';

export default function Tabbed(props: {children: ReactNode[], tabNames: string[], className?: string}) {
    let [item, setItem] = useState(0);
    let classNames="";
    if (props.className) {
        classNames += ` ${props.className}`
    }
    if (props.tabNames.length !== props.children.length) {
        console.error("length of tab names != number of tabs")
    }
    return (
        <div className={classNames}>
            <div className="tab-bar">
                {
                    props.children.map((v, i) =>
                        (<button onClick={() => setItem(i)}>{props.tabNames[i]}</button>)
                    )
                }
            </div>
            <div className="tab">{props.children[item]}</div>
        </div>
    )
}
