<template>
  <div class="container okw-detail-page">
    <aside class="sidebar">
      <h3>Filters</h3>
      <ul>
        <li><a href="#">Category 1</a></li>
        <li><a href="#">Category 2</a></li>
        <li><a href="#">Category 3</a></li>
        <li><a href="#">Category 4</a></li>
        <li><a href="#">Category 5</a></li>
        <li><a href="#">Category 6</a></li>
      </ul>
      <h3>We can make</h3>
      <ul>
        <li><a href="#">Product 1</a></li>
        <li><a href="#">Product 2</a></li>
        <li><a href="#">Product 3</a></li>
        <li><a href="#">Product 4</a></li>
        <li><a href="#">Product 5</a></li>
      </ul>
      <h3>Tools and Processes</h3>
      <ul>
        <li><a href="#">Name</a></li>
        <li><a href="#">Name</a></li>
        <li><a href="#">Name</a></li>
      </ul>
      <h3>Roles</h3>
      <h3>Resources</h3>
      <h3 href="#">Availability</h3>
      <h3>Contact Information</h3>
    </aside>

    <main class="main-content">
      <div class="okw-section">
        <h2>OKW Name / Description of OKW</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
          vulputate libero et velit interdum, ac aliquet odio mattis. Class
          condimentum lobortis. Ut commodo efficitur neque. Lorem ipsum dolor
          sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit
          interdum, ac aliquet odio mattis.
        </p>
        <div class="btn-wrap">
          <button class="order-btn">ORDER</button>
          <button class="contact-btn">CONTACT SUPPLIER</button>
          <p class="contact-info">Website: <a href="#">www.example.com</a></p>
          <p class="contact-info">Phone Number <a href="#"></a></p>
        </div>
      </div>

      <div class="tabs">
        <a href="#" class="active">Profile</a>
        <a href="#">Certifications</a>
        <a href="#">Additional Information</a>
        <a href="#">Diversity</a>
        <a href="#">Contact</a>
      </div>

      <div class="tabs">
        <a href="#">Tools</a>
        <a href="#">Processes</a>
        <a href="#">Products</a>
        <a href="#">Inventory</a>
      </div>

      <div class="business-section">
        <h2>Business Description / Name/ Entity name</h2>
        <p>
          Torem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
          vulputate libero et velit interdum, ac aliquet odio mattis. Class
          aptent taciti sociosqu ad litora torquent per conubia nostra, per
          inceptos himenaeos. Curabitur tempus urna at turpis condimentum
          lobortis. Ut commodo efficitur neque. Torem ipsum dolor sit amet,
          consectetur adipiscing elit. Nunc vulputate libero et velit interdum,
          ac aliquet odio mattis. Class aptent taciti sociosqu ad litora
          torquent per conubia nostra, per inceptos himenaeos. Curabitur tempus
          urna at turpis condimentum lobortis. Ut commodo efficitur neque.
        </p>
        <div class="details">
          <div>
            <h3>Specifications</h3>
            <p>Detail: Lorem ipsum</p>
            <p>Detail: Lorem ipsum</p>
            <p>Detail: Lorem ipsum</p>
            <p>Detail: Lorem ipsum</p>
          </div>
          <div>
            <h3>Business Details</h3>
            <p>Website: <a href="#">www.example.com</a></p>
            <p>Product: <a href="#">Product Name</a></p>
            <p>Torem ipsum: <a href="#">Detail</a></p>
          </div>
          <div>
            <h3>Customer Reviews</h3>
            <p>★★★★☆ 4 out of 5</p>
            <p>Name Name - "Lorem ipsum dolor sit amet"</p>
            <p>Name Name - "Lorem ipsum dolor sit amet"</p>
          </div>
          <div>
            <h3>About Supplier</h3>
            <p>Website: <a href="#">www.example.com</a></p>
            <p>Product: <a href="#">Product Name</a></p>
            <p>Torem ipsum: <a href="#">Detail</a></p>
          </div>
        </div>
        <div class="verified">
          <img src="https://via.placeholder.com/40x40?text=H" alt="Verified" />
          <p>Helpful verified</p>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.okw-detail-page.container {
  display: flex;
  margin: 150px auto 0 auto;

  .sidebar {
    width: 200px;
    background-color: #e9ecef;
    padding: 10px;
    margin-right: 20px;
    flex: 1 1 35%;
  }

  .sidebar h3 {
    font-size: 16px;
    margin-bottom: 10px;
  }

  .sidebar ul {
    list-style: none;
  }

  .sidebar ul li {
    margin-bottom: 5px;
  }

  .sidebar ul li a {
    color: #003087;
    text-decoration: none;
  }

  .okw-section {
    background-color: #fff;
    padding: 20px;
    border: 1px solid #ddd;
    margin-bottom: 20px;
  }

  .okw-section h2 {
    font-size: 20px;
    margin-bottom: 10px;
  }

  .okw-section p {
    font-size: 14px;
    line-height: 1.5;
  }

  .okw-section .btn-wrap {
    display: flex;
    align-items: center;
  }

  .okw-section .order-btn {
    background-color: #a6f671;
    color: black;
    padding: 8px 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-right: 10px;
  }

  .okw-section .contact-btn {
    background-color: transparent;
    border: 2px solid#D9D9D9;
    color: black;
    padding: 8px 15px;
    border-radius: 4px;
    cursor: pointer;
  }

  .contact-info {
    padding: 0 20px;
  }
  .tabs {
    display: flex;
    margin-bottom: 10px;
  }

  .tabs a {
    color: #333;
    text-decoration: none;
    padding: 10px;
    border-bottom: 2px solid transparent;
  }

  .tabs a.active {
    border-bottom-color: #007bff;
  }

  .business-section {
    background-color: #fff;
    padding: 20px;
    border: 1px solid #ddd;
  }

  .business-section h2 {
    font-size: 18px;
    margin-bottom: 10px;
  }

  .business-section p {
    font-size: 14px;
    line-height: 1.5;
  }

  .details {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-top: 10px;
  }

  .details div {
    background-color: #f8f9fa;
    padding: 10px;
  }

  .details div h3 {
    font-size: 14px;
    margin-bottom: 5px;
  }

  .details div p {
    font-size: 12px;
  }

  .reviews {
    background-color: #f8f9fa;
    padding: 10px;
    margin-top: 10px;
  }

  .reviews h3 {
    font-size: 14px;
    margin-bottom: 5px;
  }

  .reviews p {
    font-size: 12px;
  }

  .verified {
    display: flex;
    align-items: center;
    margin-top: 20px;
  }

  .verified img {
    height: 40px;
    margin-right: 10px;
  }

  .verified p {
    font-size: 12px;
  }

  .main-title {
    color: #2a3952;
  }
}
</style>
