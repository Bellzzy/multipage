import com from '@/common/common.js'
import $ from 'jquery'
import '@/css/style.css'

$.ajax({
    url: 'http://g.cn',
    dataType:'json'
}).done(function(data, status, xhr){
    console.log(
    	JSON.stringify(data, null, 4), typeof data
    )
    let text = `<h1>姓名:` + data.name + `<br>年龄:` + data.age + `</h1>`
	$('#app').html(text).css({color: data.color})
})
