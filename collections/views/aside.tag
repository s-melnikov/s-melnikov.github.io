<tag-aside>

  <div class="page-aside">
    <ul class="nav">
      <li class="nav-item">
        <a href="#">Home</a>
      </li>
      <li class="nav-item">
        <a href="#!/collections">Collections</a>
        <ul if={ collections.length }>
          <li each={ collection in collections } class="nav-item">
            <tag-link to={ "/collection/" + collection.slug + "/entries" }>{collection.title}</tag-link>
          </li>
        </ul>
      </li>
    </ul>
  </div>

  <style>
    :scope {
      display: block;
      height: 100%;
    }
  </style>

  <script>
    log("@aside");

    this.collections = opts.collections || [];

  </script>
</tag-aside>