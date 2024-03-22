$(document).on('click', '#padre', function (event) {
    event.preventDefault();
    tbody = $("#hijo");
    if (tbody.hasClass('invisible')) {
        tbody.removeClass('invisible');
        tbody.addClass('visible');
    } else {
        tbody.removeClass('visible');
        tbody.addClass('invisible');
    }
});