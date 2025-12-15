    import { expect } from '@playwright/test';

    exports.CartPage = class CartPage {
    
    
constructor(page) {
    
    this.page = page;
    this.productList = '.inventory_item_name';
    // 🎯 Define the locator here
    this.yourCartTitle = page.getByText("Your Cart", { exact: true });

}

async VerifyUserOnCartPage() {
   // ✅ Use the defined locator here
   await expect(this.yourCartTitle).toBeVisible(); 
   
   console.log('✅ Yes – Welcome to AddtoCart page');
    
   // Optional visual pause
   await this.page.waitForTimeout(2000);

}

}
/*
        constructor(page) {
    
            this.page = page;
            this.productList = '.inventory_item_name';
            //this.YourCart= page.getByText("Your Cart", { exact: true });
    
        }
        async VerifyUserOnCartPage() {
           // await expect(this.page.locator("//span[text()='Your Cart']")).toContainText('Your Cart');  // not works 
            await expect(this.page.getByText("Your Cart", { exact: true }))
        .toBeVisible();
            console.log('✅ Yes – Welcome to AddtoCart page');
            
        // Optional visual pause
            await this.page.waitForTimeout(2000);

        }


}
*/