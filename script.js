const username = "ghostjson"
const getData = () => {
  /**
   * Initialized like this so typescript can infer the type
   */
  let followers = [{ username: "", full_name: "" }]
  let followings = [{ username: "", full_name: "" }]
  let dontFollowMeBack = [{ username: "", full_name: "" }]
  let iDontFollowBack = [{ username: "", full_name: "" }]

  followers = []
  followings = []
  dontFollowMeBack = []
  iDontFollowBack = []
  ;(async () => {
    try {
      console.log(`Process started! Give it a couple of seconds`)

      const userQueryRes = await fetch(
        `https://www.instagram.com/web/search/topsearch/?query=${username}`
      )

      const userQueryJson = await userQueryRes.json()

      const userId = userQueryJson.users[0].user.pk

      let after = null
      let has_next = true

      while (has_next) {
        await fetch(
          `https://www.instagram.com/graphql/query/?query_hash=c76146de99bb02f6415203be841dd25a&variables=` +
            encodeURIComponent(
              JSON.stringify({
                id: userId,
                include_reel: true,
                fetch_mutual: true,
                first: 50,
                after: after,
              })
            )
        )
          .then((res) => res.json())
          .then((res) => {
            has_next = res.data.user.edge_followed_by.page_info.has_next_page
            after = res.data.user.edge_followed_by.page_info.end_cursor
            followers = followers.concat(
              res.data.user.edge_followed_by.edges.map(({ node }) => {
                return {
                  username: node.username,
                  full_name: node.full_name,
                }
              })
            )
          })
      }

      console.log({ followers })

      after = null
      has_next = true

      while (has_next) {
        await fetch(
          `https://www.instagram.com/graphql/query/?query_hash=d04b0a864b4b54837c0d870b0e77e076&variables=` +
            encodeURIComponent(
              JSON.stringify({
                id: userId,
                include_reel: true,
                fetch_mutual: true,
                first: 50,
                after: after,
              })
            )
        )
          .then((res) => res.json())
          .then((res) => {
            has_next = res.data.user.edge_follow.page_info.has_next_page
            after = res.data.user.edge_follow.page_info.end_cursor
            followings = followings.concat(
              res.data.user.edge_follow.edges.map(({ node }) => {
                return {
                  username: node.username,
                  full_name: node.full_name,
                }
              })
            )
          })
      }

      console.log({ followings })

      dontFollowMeBack = followings.filter((following) => {
        return !followers.find(
          (follower) => follower.username === following.username
        )
      })

      console.log({ dontFollowMeBack })

			document.querySelector("#fb-list").innerHTML = ""
      for (const f of dontFollowMeBack) {
        document.querySelector("#fb-list").innerHTML += `				<li>
				<p style="margin: 0"><strong>${f.full_name}</strong></p>
				<p style="margin: 0"><a href="https://www.instagram.com/${f.username}" target="_blank" style="text-decoration: underlined; cusor: pointer;color: rgb(0, 75, 145);">${f.username}</a></p>
			</li>`
      }

      iDontFollowBack = followers.filter((follower) => {
        return !followings.find(
          (following) => following.username === follower.username
        )
      })

      console.log({ iDontFollowBack })

      console.log(
        `Process is done: Type 'copy(followers)' or 'copy(followings)' or 'copy(dontFollowBack)' in the console and paste it into a text editor to take a look at it'`
      )
    } catch (err) {
      console.log({ err })
    }
  })()
}

if (window.location.href === `https://www.instagram.com/${username}/`) {
  console.log("true")
  // action button
  const actionButton = document.createElement("button")
  actionButton.innerText = "Dashboard"
  actionButton.classList = ["instagram-action-button"]

  actionButton.addEventListener("click", () => {
    const dialog = document.querySelector(".instagram-dialog-box")
    if (dialog.style.display === "block") {
      dialog.style.display = "none"
    } else {
      dialog.style.display = "block"
      getData()
    }
  })

  document.querySelector("body").appendChild(actionButton)

  const dialog = document.createElement("div")
  dialog.classList = "instagram-dialog-box"
  dialog.innerHTML += `
	<div>
		<h2 style="font-size: 1.5em; margin: 10px;">Dashboard</h2>
		<h3 style="font-size: 1.1em; margin: 10px;">People don't follow back:</h3>
		<div style="margin: 10px">
			<ol id="fb-list">
				<strong>Loading....</strong>
			</ol>
		</div>
	</div>
`
  document.querySelector("body").appendChild(dialog)
}
