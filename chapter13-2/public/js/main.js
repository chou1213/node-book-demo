$(function() {
    console.log($('#projects-li').length);
    $('form').submit(function(ev) {
        ev.preventDefault();
        var form = $(this);
        $.ajax({
            url: form.attr('action'),
            type: 'POST',
            data: form.serialize(),
            success: function(obj) {
                console.log(obj);
                var el = $('<li>');
                console.log($('#projects-li'));
                if ($('#projects-li')) {
                    el.append($('<a>').attr('href', '/project/' + obj.id + '/tasks').text(obj.title + '   '))
                        .append($('<a>').attr('href', '/project/' + obj.id).attr('class', 'delete').text('x'));
                } else {
                    el.append($('<span>').text(obj.title + ' '))
                        .append($('<a>').attr('href', '/task/' + obj.id)
                            .attr('class', 'delete').text('x'));
                }
                $('ul').append(el);
            }
        })
        form.find('input').val('');
    });

    $('ul').delegate('a.delete', 'click', function(ev) {
        ev.preventDefault();
        var li = $(this).closest('li');
        $.ajax({
            url: $(this).attr('href'),
            type: 'DELETE',
            success: function() {
                li.remove();
            }
        });
    });
})