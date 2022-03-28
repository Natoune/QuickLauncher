const { Client, Authenticator } = require('minecraft-launcher-core');
const sleep = require('sleep');
var prompt = require('prompt');
const request = require('request');
let list = [];
request('https://natoune.github.io/MinecraftResources/versions/versions.json', function (error, response, body) {
    if (error) throw error;
    json = JSON.parse(body);
    for (const number in json) {
        list.push(json[number].id);
    }
});

process.stdout.write('\x1Bc');
console.log('\x1b[33m====================================');
console.log('\x1b[33m===== QUICKLAUNCHER BASH v1.0.0 =====');
console.log('\x1b[33m====================================\r\n');

function getVersion() {
    prompt.start();
    console.log('\x1b[0mLa liste des versions de Minecraft est disponible ici: \x1b[36m\x1b[4mhttps://natoune.github.io/MinecraftResources/versions/versions.json\x1b[0m');
    console.log('\x1b[0mTapez ici la version de Minecraft que vous voulez lancer');
    prompt.get('Version', function (err, result) {
        if (list.indexOf(result.Version) < 0) {
            process.stdout.write('\x1Bc'); 
            console.log('\x1b[31mLa version '+result.Version+' n\'existe pas !');
            sleep.sleep(2);
            process.stdout.write('\x1Bc'); 
            console.log('\x1b[33m===== QUICKLAUNCHER BASH v1.0.0 =====\r\n');
            getVersion();
        } else {
            request('https://natoune.tk/launcher/'+result.Version+'/type', function (error, response, body) {
                if (error) throw error;
                json = JSON.parse(body);
                let type = json['type'];

                let version = result.Version;

                console.log('\r\n\x1b[0mTapez ici votre pseudo Minecraft');
                prompt.get('Pseudo', function (err, result) {
                    if (!result.Pseudo) result.Pseudo = 'Steve';
                    launch(version.toString(), type, result.Pseudo.toString());
                });
            });
        }
    });
}

getVersion();

function launch(version, type, username) {
    const launcher = new Client();
    let opts = {
        clientPackage: null,
        authorization: Authenticator.getAuth(username),
        root: "./minecraft",
        version: {
            number: version,
            type: type
        },
        overrides: {
            url: {
                meta: 'https://proxy.eslnk.cf/ESProxy/?u=https://launchermeta.mojang.com',
                resource: 'https://rckld.eslnk.cf/MinecraftResources/resources',
                mavenForge: 'https://proxy.eslnk.cf/ESProxy/?u=http://files.minecraftforge.net/maven/',
                defaultRepoForge: 'https://proxy.eslnk.cf/ESProxy/?u=https://libraries.minecraft.net/',
                fallbackMaven: 'https://proxy.eslnk.cf/ESProxy/?u=https://search.maven.org/remotecontent?filepath='
            }
        }
        // memory: {
        //     max: "1G",
        //     min: "1G"
        // }
    }

    process.stdout.write('\x1Bc');
    console.log('\x1b[33m===== QUICKLAUNCHER BASH v1.0.0 =====\r\n\x1b[0m');
    
    launcher.launch(opts);
    
    launcher.on('debug', (e) => console.log(e));
    launcher.on('data', (e) => console.log(e));
}