const request = new XMLHttpRequest(),
    socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);;

function dq(x){ 
    return document.querySelector(x); 
}

socket.on('all messages', data => { // data=[{n:name,ts:time,msg:message},...]
    let ul='',u=dq('#talk ul');
    data.forEach((d,ix)=>{ ul+='<li>'+msg_li(d.n,d.ts,d.msg)+'</li>'; });
    u.innerHTML=ul;
    u.scrollTo(0,u.scrollHeight);
});
socket.on('new message', data => { // data={cn:channel, nm:name,ts:time,msg:message}
    if(data['cn']!=localStorage.getItem('cname')) { console.log('not for me'); return; }
    let li=document.createElement('li'),u=dq('#talk ul');
    li.innerHTML=msg_li(data.n,data.ts,data.msg);
    dq('#talk ul').append(li);
    u.scrollTo(0,u.scrollHeight);
});

function msg_li(name,ts,msg){ // format a message line a bit like slack with bold/italic/code/etc
    let i,m,v;
    m=msg.match(/```[^`]+```/g);
    if(m) for(i=0;i<m.length;i++) msg = msg.replace(m[i],`<code>${m[i].replace(/^```|```$/g,'')}</code>`);
    m=msg.match(/`[^`]+`/g);
    if(m) for(i=0;i<m.length;i++) msg = msg.replace(m[i],`<span class='red'>${m[i].replace(/^`|`$/g,'')}</span>`);
    m=msg.match(/\*[^\*]+\*/g);
    if(m) for(i=0;i<m.length;i++) msg = msg.replace(m[i],`<b>${m[i].replace(/^\*|\*$/g,'')}</b>`);
    m=msg.match(/_[^_]+_/g); 
    if(m) for(i=0;i<m.length;i++) msg = msg.replace(m[i],`<i>${m[i].replace(/^_|_$/g,'')}</i>`);
    let c=name.charAt(0).toUpperCase(),h=(c.charCodeAt(0)-64)*355/26; // A-Z -> 0-355
    return `<b style='background:hsl(${h}, 100%, 35%)'>${c}</b>
        <div><b>${name}</b> <small>${ts}</small><br><span>${msg}</span></div>`;
}
function show_chan_list(){
    if (!localStorage.getItem('dname')) return; 
    dq('#content').className='list'; // show the list section via CSS display:block
    localStorage.setItem('last','list');
    let dom=dq('#list ul')
    dom.innerHTML="Loading channels...";
    // AJAX in the channels via [ {cn:channel-name, dn:creator-display-name, dt:date},...]
    request.open('GET', "/channels",true);
    request.onload = () => {
        const data = JSON.parse(request.responseText);
        let ul='',cn=localStorage.getItem('cname');
        data.forEach(function(v,ix){
            ul+=`<li${v.cn==cn?' class="on"':''}><div># <b>${v.cn}</b></div>
                <small>Created by <strong>${v.dn}</strong> on ${v.dt}</small>
                <span>Click to Join <small>(${v.msgs<100?v.msgs:'100+'})</small></span></li>`;
        });
        dom.innerHTML=ul;
        document.querySelectorAll('#list li').forEach((li,ix)=>{ 
            li.onclick=function(){ talk(li.querySelector('b').innerHTML); } 
        });
    }
    request.send(null);
}

function talk(channel){ // talk in the specific channel
    localStorage.setItem('cname',channel);
    dq('#talk .cname').innerHTML=channel;
    dq('#talk ul').innerHTML='';
    dq('#content').className='talk'; // show (via CSS display:block) the talk section
    localStorage.setItem('last','talk');
    socket.emit('get_in', {'cn': channel});
}

document.addEventListener('DOMContentLoaded', function() {
    if(!localStorage.getItem('dname')) dq('#content').className='login';
    else {
        if(localStorage.getItem('last')=='talk') talk(localStorage.getItem('cname'))
        else {
            dq('#wback big').innerHTML=localStorage.getItem('dname');
            dq('#content').className='wback';
        }
    }

    dq('#dname').onkeyup=function(){ dq('#login button').className=(this.value.length>0?'':'nop');  }
    
    dq('#cname').onkeyup=function(){ dq('#create button').className=(this.value.length>0?'':'nop');  }

    dq('#login button').onclick=function(){
        if(this.className=='nop') return;
        localStorage.setItem('dname',dq('#dname').value);
        show_chan_list();
    }
    dq('#wback button').onclick=function(){
        dq('#content').className='login';
        localStorage.setItem('last','');
        localStorage.setItem('dname','');
    }
    dq('#create button').onclick=function(){
        if(this.className=='nop') return;
        const channel=dq('#cname').value,d=new Date(),dn=encodeURIComponent(localStorage.getItem('dname'));
        let url=`/create?by=${dn}&cn=${encodeURIComponent(channel)}&ts=${d.toLocaleDateString()}`;
        request.open('GET', url,true);
        request.onload = () => { 
            if(request.responseText=='ok') {
                talk(channel);
                dq('#cname').value=''
            } else alert("Duplication name\r\nMaybe enter a different one")
        }
        request.send(null);
    }
    dq('#talk button').onclick=function(){
        const msg=dq('#msg').value, d=new Date();
        let nm=localStorage.getItem('dname'),ts=d.toLocaleTimeString();
        socket.emit('add_msg', {'cn':localStorage.getItem('cname'), 'n':nm, 'ts':ts, 'msg':msg});
        dq('#msg').value='';
    }
});