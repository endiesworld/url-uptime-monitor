An 'uptime monitor' allows users to enter URLs they want monitored, and receive alert when those resources "go down" or "come back up".

The app will be open to all kind of users, and will require user sign-up and sign-in.
URL notification will be sent to user via SMS alert.

Requiremnt for API
1). The API listens on a port and accepts incoming HTTP requests for POST, GET, PUT, DELETE and HEAD
2). The API allows a client to connect, then create a new user, then edit and delete that user
3). The API allows a user to "sign in" which gives them a token that they can use for susequent authenticated requests.
4). The API allows the user to "sign out" which invalidates their token.
5). The API allows a signed-in user to use their token to create a new "check". "Check" is a task to confrim if a given URL is up or down ? The user should be able to define what up ir down is.
6). Sgined in user should be able to edit or delete any of their checks, and checks should be limited to only five.
7). In the background, workers perform all the "checks at the appropriate times, and send alerts to the users when a check changes its state from "up" to "down", or vise versa.
