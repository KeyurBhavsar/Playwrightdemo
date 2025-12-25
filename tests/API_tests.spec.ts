import { test, expect } from '@playwright/test';
var userid; 

test("Get Users", async ({ request }) => {

    const response = await request.get(
        'https://reqres.in/api/users',
        {
          headers: {
            'x-api-key': 'pub_52ead470a0401caa503f35262e943360'
          }
        }
      );
    // Parse JSON
    const data = await response.json();
    console.log(data);

    // Correct expect syntax
    expect(response.status()).toBe(200);

});

test("Create a user ", async ({ request }) => {

    const response = await request.post( 'https://reqres.in/api/users',
        {
         
            data: {"name":"Keyur","job":"QA"},
            headers: {
            'x-api-key': 'pub_52ead470a0401caa503f35262e943360'
          }

        }
      );
    // Parse JSON
    const data = await response.json();
    console.log(data);

    // Correct expect syntax
    expect(response.status()).toBe(201);

    var res = await response.json()
    userid =res.id;
});

test("Update a user ", async ({ request }) => {
    
  const response = await request.put(
    'https://reqres.in/api/users/2',
    {
      headers: {
        'Accept': 'application/json',
           'x-api-key': 'pub_52ead470a0401caa503f35262e943360',
        'Content-Type': 'application/json'
      },
      data: {
        name: 'KeyurBhavsar',
        job: 'Electronics Engineer'
      }
    }
  );

  expect(response.status()).toBe(200);

  const data = await response.json();
  console.log(data);

  expect(data.name).toBe('KeyurBhavsar');
});

test("Delete a user ", async ({ request }) => {
    
    const response = await request.delete(
        'https://reqres.in/api/users/2',
        {
          headers: {
            'Accept': 'application/json',
            'x-api-key': 'pub_52ead470a0401caa503f35262e943360'
          }
        }
      );
    
      // ✅ Correct assertion
      expect(response.status()).toBe(204);
    
      // ✅ Validate empty body
      const body = await response.text();
      expect(body).toBe('');
    });
  

    test.describe('API Testing Demo', () => {

      test('verify products search API responds with 200', async ({ request }) => {
    
        const response = await request.get(
          'https://dummyjson.com/products/search?q=mascara',
          {
            headers: {
              'User-Agent': 'playwright-training-demo',
              'Accept': 'application/json',
              'X-Client-Name': 'PlaywrightHomework'
            }
          }
        );
    
        // ✅ Status check
        expect(response.status()).toBe(200);
    
        const responseBody = await response.json();
        console.log(responseBody);
    
        // ✅ Safe assertions
        expect(responseBody).toHaveProperty('products');
        expect(responseBody.products.length).toBeGreaterThan(0);
    
        const first = responseBody.products[0];
    
        // ✅ Robust checks (DO NOT hardcode ID)
        expect(first).toHaveProperty('id');
        expect(first).toHaveProperty('title');
        expect(first).toHaveProperty('price');
        expect(first).toHaveProperty('category');
    
      });
    
    });
    

test("Product Search API test", async ({request}) => {
 
    //  Make the request to API endpoint
    const response = await request.get("https://dummyjson.com/products/search",{    
        headers:{
 
            'User-Agent': 'playwright-training-demo',
            'Accept': 'application/json',
            'X-Client-Name': 'PlaywrightHomework',
        },
        params:{
 
            'q': 'phone',
            'limit' : '2',
            'skip' : '0'
        }
 
    });
 
    // Verify the responce Status
    expect(response.status()).toBe(200);
 
    // Parse JSON response
    const responseBody = await response.json();
 
    // Verify there are two products
    expect(responseBody.products.length).toBe(2)
    const product1 = responseBody.products[0];
    const product2 = responseBody.products[1];
 
    // Verify response of 1st product
    expect(product1).toHaveProperty('id', 101);
    expect(product1).toHaveProperty('title');
    expect(product1.title).toBe('Apple AirPods Max Silver');
 
    // Verify response of 2nd product
    expect(product2).toHaveProperty('id');
    expect(product2).toHaveProperty('id', 104);
    expect(product2).toHaveProperty('title');
    expect(product2.title).toBe('Apple iPhone Charger');
 
});
