const exec = require('child_process').execSync;
const fs = require('fs');
const request = require('request');

// 公共变量
const SERVER_J = process.env.SERVER_J;

function sendNotify(text, desp) {
	const options = {
		uri: `https://sc.ftqq.com/${SERVER_J}.send`,
		form: { text, desp },
		json: true,
		method: 'POST'
	};
	request.post(options, (res) => console.log(res));
}

function start() {
	exec('node ./JD-DailyBonus/JD_DailyBonus.js > result.txt');
	console.log('执行完毕');

	if (SERVER_J) {
		const path = './result.txt';
		let content = '';
		if (fs.existsSync(path)) {
			content = fs.readFileSync(path, 'utf8');
		}
		let t = content.match(/【签到概览】:((.|\n)*)【签到总计】/);
		let res = t ? t[1].replace(/\n/, '') : '失败';
		let t2 = content.match(/【签到总计】:((.|\n)*)【账号总计】/);
		let res2 = t2 ? t2[1].replace(/\n/, '') : '总计0';

		sendNotify('' + ` ${res2} ` + ` ${res} ` + new Date().toLocaleDateString(), content);
		console.log('发送通知');
	}
}

start();
