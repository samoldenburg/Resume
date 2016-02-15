# Resume
Simple repository for my resume.

Built using foundation

```php
<?php


class SBProjectProfiles {

    public static $text_domain = 'stellar-blue-project-profiles';
    public static $post_type = 'sbproject';
    public static $taxonomy = 'sbcategory';
    public static $taxonomy_tags = 'sbtags';
    public static $dashicon = 'dashicons-images-alt2';
    public static $register_tags = false;

    public static function register_hooks() {
        add_action('init', array(__CLASS__, 'register_post_types'));
        add_action('init', array(__CLASS__, 'register_taxonomies'));

        // category meta
        add_action(self::$taxonomy . '_add_form_fields', array(__CLASS__, 'add_meta_fields'));
        add_action(self::$taxonomy . '_edit_form_fields', array(__CLASS__, 'add_meta_fields'));
        add_action('edited_' . self::$taxonomy, array(__CLASS__, 'save_category_meta'));
        add_action('create_' . self::$taxonomy, array(__CLASS__, 'save_category_meta'));
        add_filter('manage_edit-' . self::$taxonomy . '_columns', array(__CLASS__, 'category_edit_columns'), 10);
        add_action('manage_' . self::$taxonomy . '_custom_column', array(__CLASS__, 'category_custom_columns'), 10, 3);
    }

    public static function register_post_types() {
        $labels = array(
    		'name'               => _x('Projects', 'post type general name', self::$text_domain),
    		'singular_name'      => _x('Project', 'post type singular name', self::$text_domain),
    		'menu_name'          => _x('Projects', 'admin menu', self::$text_domain),
    		'name_admin_bar'     => _x('Project', 'add new on admin bar', self::$text_domain),
    		'add_new'            => _x('Add New', 'Project', self::$text_domain),
    		'add_new_item'       => __('Add New Project', self::$text_domain),
    		'new_item'           => __('New Project', self::$text_domain),
    		'edit_item'          => __('Edit Project', self::$text_domain),
    		'view_item'          => __('View Project', self::$text_domain),
    		'all_items'          => __('All Projects', self::$text_domain),
    		'search_items'       => __('Search Projects', self::$text_domain),
    		'parent_item_colon'  => __('Parent Projects:', self::$text_domain),
    		'not_found'          => __('No Projects found.', self::$text_domain),
    		'not_found_in_trash' => __('No Projects found in Trash.', self::$text_domain)
    	);

    	$args = array(
    		'labels'             => $labels,
            'description'        => __('Description.', self::$text_domain),
    		'public'             => true,
    		'publicly_queryable' => true,
    		'show_ui'            => true,
    		'show_in_menu'       => true,
    		'query_var'          => true,
    		'rewrite'            => array('slug' => 'technical-expertise'),
    		'capability_type'    => 'post',
    		'has_archive'        => true,
    		'hierarchical'       => false,
    		'menu_position'      => null,
            'menu_icon'          => self::$dashicon,
    		'supports'           => array('title') // by default title only, add everything else in with custom fields.
    	);

    	register_post_type(self::$post_type, $args);
    }

    public static function register_taxonomies() {
    	$labels = array(
    		'name'              => _x('Categories', 'taxonomy general name', self::$text_domain),
    		'singular_name'     => _x('Category', 'taxonomy singular name', self::$text_domain),
    		'search_items'      => __('Search Categories', self::$text_domain),
    		'all_items'         => __('All Categories', self::$text_domain),
    		'parent_item'       => __('Parent Category', self::$text_domain),
    		'parent_item_colon' => __('Parent Category:', self::$text_domain),
    		'edit_item'         => __('Edit Category', self::$text_domain),
    		'update_item'       => __('Update Category', self::$text_domain),
    		'add_new_item'      => __('Add New Category', self::$text_domain),
    		'new_item_name'     => __('New Category Name', self::$text_domain),
    		'menu_name'         => __('Project Categories', self::$text_domain)
    	);

    	$args = array(
    		'hierarchical'      => true,
    		'labels'            => $labels,
    		'show_ui'           => true,
    		'show_admin_column' => true,
    		'query_var'         => true,
    		'rewrite'           => array('slug' => 'project-category'),
    	);

    	register_taxonomy(self::$taxonomy, self::$post_type, $args);

        if (self::$register_tags) {
            $labels = array(
        		'name'              => _x('Tags', 'taxonomy general name', self::$text_domain),
        		'singular_name'     => _x('Tag', 'taxonomy singular name', self::$text_domain),
        		'search_items'      => __('Search Tags', self::$text_domain),
        		'all_items'         => __('All Tags', self::$text_domain),
        		'parent_item'       => __('Parent Tag', self::$text_domain),
        		'parent_item_colon' => __('Parent Tag:', self::$text_domain),
        		'edit_item'         => __('Edit Tag', self::$text_domain),
        		'update_item'       => __('Update Tag', self::$text_domain),
        		'add_new_item'      => __('Add New Tag', self::$text_domain),
        		'new_item_name'     => __('New Tag Name', self::$text_domain),
        		'menu_name'         => __('Portfolio Tags', self::$text_domain)
        	);

        	$args = array(
        		'hierarchical'      => true,
        		'labels'            => $labels,
        		'show_ui'           => true,
        		'show_admin_column' => true,
        		'query_var'         => true,
        		'rewrite'           => array('slug' => 'portfolio-tag'),
        	);

        	register_taxonomy(self::$taxonomy_tags, self::$post_type, $args);
        }
    }

    public static function add_meta_fields() {
        wp_nonce_field( 'save_category_meta', 'sb_category_meta_nonce' );

        ?>
        <div class="form-field">
        	<label for="sb_catimg">Category Image URL</label>
        	<input type="text" id="sb_catimg" name="sb_catimg" value="<?=get_term_meta($_GET['tag_ID'], 'sb_catimg', true);?>" class="" />
        </div>
        <?php
    }

    public static function save_category_meta($term_id) {
        if (!isset( $_POST['sb_category_meta_nonce'] ) || !wp_verify_nonce( $_POST['sb_category_meta_nonce'], 'save_category_meta'))
            return;

        update_term_meta($term_id, 'sb_catimg', $_POST['sb_catimg']);
    }

    public static function category_edit_columns($columns) {
        $columns['sb_catimg'] = "Category Image";
        return $columns;
    }

    public static function category_custom_columns($content, $column_name, $term_id) {
        switch ($column_name) {
            case "sb_catimg":
                echo '<div style="background-color: #ddd;background-image:-moz-linear-gradient(45deg, #ccc 25%, transparent 25%,transparent 75%, #ccc 75%, #ccc 100%),-moz-linear-gradient(45deg, #ccc 25%, transparent 25%,transparent 75%, #ccc 75%, #ccc 100%);background-image:-webkit-linear-gradient(45deg, #ccc 25%, transparent 25%,transparent 75%, #ccc 75%, #ccc 100%),-webkit-linear-gradient(45deg, #ccc 25%, transparent 25%,transparent 75%, #ccc 75%, #ccc 100%);-moz-background-size:20px 20px;background-size:20px 20px;-webkit-background-size:20px 20px;background-position:0 0, 50px 50px;padding: 10px; text-align: center;"><img src="' . get_term_meta($term_id, 'sb_catimg', true) . '" style="max-width: 100px; height: auto;"></div>';
                break;
        }
    }

    public static function query($caller_args = array()) {
        $args = array(
            'post_type' => self::$post_type,
        );

        $args = array_merge($args, $caller_args);

        return new WP_Query($args);
    }

    // Will create a new one, or update an existing one if $post['id'] exists.
    public static function create($post) {
        $npost = array();
        $npost['post_content'] = $post['sbcontent'];
        $npost['post_title'] = $post['sbtitle'];
        $npost['post_author'] = get_current_user_id();
        $npost['post_type'] = self::$post_type;
        $npost['post_status'] = 'publish';
        $npost['tax_input'] = $post['tax_input'];

        if (isset($post['sbid']))
            $npost['ID'] = $post['sbid'];

        $post_id = wp_insert_post($npost);

        update_post_meta($post_id, 'sbc_email_address', $post['sbemail']);
        update_post_meta($post_id, 'sbc_phone_number', $post['sbphone']);

        global $new_post_id;
        $new_post_id = $post_id;
    }

    public static function delete($id) {
        wp_trash_post($id);
    }

}

function sb_term_split($terms) {
    $holder = array();
    foreach ($terms as $term) {
        $holder[] = $term->slug;

        // include the parent if it exists, if we need more than 2 levels of categories recursion will become necessary
        if ($term->parent != 0) {
            $pterm = get_term($term->parent, SBProjectProfiles::$taxonomy);
            $holder[] = $pterm->slug;
        }
    }
    return implode(" ", $holder);
}

SBProjectProfiles::register_hooks();

```
