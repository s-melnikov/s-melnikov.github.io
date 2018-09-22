<tag-navbar>

  <header class="navbar">
    <section class="navbar-section">
      <div class="dropdown">
        <a href="#" class="btn btn-link dropdown-toggle">
          Collections <span class="icon icon-caret"></span>
        </a>
        <ul class="menu">
          <li class="menu-item">
            <a href="#">Collection</a>
          </li>
          <li class="menu-item">
            <a href="#">Collection</a>
          </li>
          <li class="menu-item">
            <a href="#">Collection</a>
          </li>
          <li class="menu-item">
            <a href="#">Collection</a>
          </li>
          <li class="divider"></li>
          <li class="menu-item">
            <a href="#">Create collection</a>
          </li>
        </ul>
      </div>
    </section>
    <section class="navbar-section">
      <a href="#" class="btn btn-link">Sign-out</a>
    </section>
  </header>

  <style>
    :scope {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      border-bottom: 1px solid #eeeeee;
    }
    :scope .navbar .btn-link {
      font-size: .7rem;
      font-weight: 400;
    }
    .navbar {
      padding: 0 0.3rem;
      height: 2.5rem;
      font-size: .7rem;
      max-width: 920px;
      margin: 0 auto;
    }
    .dropdown ul.menu {
      animation: none;
      max-height: 100vh;
    }
  </style>

  <script>
    log("@navbar");
  </script>
</tag-navbar>