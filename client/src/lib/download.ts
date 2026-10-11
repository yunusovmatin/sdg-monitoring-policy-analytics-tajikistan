export function downloadCsv(text:string,name:string) {
  const url=URL.createObjectURL(new Blob([text],{type:"text/csv;charset=utf-8;"}));
  const link=document.createElement("a");link.href=url;link.download=name;document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),0);
}
