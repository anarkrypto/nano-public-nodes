function postJson(url, data) {
    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(data)
        }).then(function (response) {
            var contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                return response.json().then(function (json) {
                    resolve(json)
                });
            } else {
                reject("Oops, we haven't got JSON!");
            }
        }).catch(function (error) {
            reject(error)
        })
    })
}

function getJson(url) {
    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'GET',
        }).then(function (response) {
            var contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                return response.json().then(function (json) {
                    resolve(json)
                });
            } else {
                reject("Oops, we haven't got JSON!");
            }
        }).catch(function (error) {
            reject(error)
        })
    })
}

function nanoNodeVersion(node_url) {
    return new Promise((resolve, reject) => {
        const action = { action: "version" }
        postJson(node_url, action)
            .then(res => {
                if ("node_vendor" in res) {
                    resolve({
                        res: res,
                        node_url: node_url
                    })
                } else {
                    reject({
                        err: "node_vendor not found",
                        node_url: node_url
                    })
                }
            }).catch(err => {
                reject({
                    err: err,
                    node_url: node_url
                })
            })
    })
}

function listNodesStatus(publicNodes) {
    for (let i in publicNodes) {
        nanoNodeVersion(publicNodes[i])
            .then(res => {
                document.querySelector('li.node[data="' + res.node_url + '"]').classList.add("online")
            })
            .catch(err => {
                console.log("err: " + err.node_url)
                document.querySelector('li.node[data="' + err.node_url + '"]').classList.add("offline")
                console.log(publicNodes[i] + " " + err.err)
            })
    }
}

function listPublicNodes() {
    const nodeListFile = "nodes.json"
    getJson(nodeListFile).then(publicNodes => {
        for (let i in publicNodes) {
            let optionNode = '<li class="node" data="' + publicNodes[i] + '">' + publicNodes[i] + '</li>'
            document.querySelector("ul#nano_nodes").innerHTML += optionNode
        }
        listNodesStatus(publicNodes)
    }).catch(err => {
        alert("Node list not found: " + nodeListFile)
    })
}

listPublicNodes()