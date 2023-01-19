const {readFileSync} =require('fs')

const dump=()=>{
    let count=0;
    for (let i=0;i<=9;i++) {
        let content=readFileSync('./data/ndef'+i+'.js','utf8').slice(13)
        content=JSON.parse(content.slice(0,content.length-1));
        for (let key in content) {
            const at=content[key].indexOf('小部')
            if (~at) {
                console.log(key, content[key] )
            }
            count++;s
        }   
    }
}

dump();