exports.LoginPage = class LoginPage {

    constructor(page) {

        this.page = page;
        this.usernameinput = '#user-name';
        this.passwordinput = '#password';
        this.loginBtn = '#login-button';
        // const Username = await page.getByPlaceholder("Username"); 
 
    }
    async gotoLoginPage() {
        await this.page.goto('https://www.saucedemo.com/');
    }

    async login(username, password) {
        await this.page.setViewportSize({ width: 1920, height: 1080 });
        await this.page.locator(this.usernameinput).fill(username);
        await this.page.locator(this.passwordinput).fill(password);
        await this.page.locator(this.loginBtn).click();

        console.log(`********\n Login Successful User: ${username}\n********`);
    }

} 