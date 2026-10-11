import { useEffect, useRef, useState, type ReactNode } from "react";
import { Button } from "./ui/button";
/** Defer expensive charts until requested or within the viewport. */
export default function DeferredSection({title,children}:{title:string;children:ReactNode}) {
  const ref=useRef<HTMLDivElement>(null);
  const [visible,setVisible]=useState(false);
  const moveFocus=useRef(false);
  const reveal=()=>{moveFocus.current=!!ref.current?.contains(document.activeElement);setVisible(true);};
  useEffect(()=>{if(visible && moveFocus.current){ref.current?.focus();moveFocus.current=false;}},[visible]);
  useEffect(()=>{
    if(visible || !ref.current) return;
    if(!("IntersectionObserver" in window)){setVisible(true);return;}
    const observer=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting)){reveal();observer.disconnect();}},{rootMargin:"0px"});
    observer.observe(ref.current);
    return ()=>observer.disconnect();
  },[visible]);
  return <div ref={ref} tabIndex={-1} role="region" aria-label={title}>{visible ? children : <section className="rounded border p-6 bg-white min-h-48"><h2 className="text-lg font-bold">{title}</h2><p className="my-4">Charts load when this section is reached.</p><Button onClick={()=>{moveFocus.current=true;setVisible(true);}}>Load {title}</Button></section>}</div>;
}
