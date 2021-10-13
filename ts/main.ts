import $ from 'jquery';
import '../img/trash.png';

const pageSize = calculatePageSize();
let pages: number = 1;
let selectedPage = 1;

/* start up focus */
$('#txt-id').trigger('focus');

/* Add or Update Row */
$('#btn-save').on('click', (eventData) => {

    eventData.preventDefault();

    const txtId = $('#txt-id');
    const txtName = $('#txt-name');
    const txtAddress = $('#txt-address');

    const id = (txtId.val() as string).trim();
    const name = (txtName.val() as string).trim();
    const address = (txtAddress.val() as string).trim();
    let valid = true;

    $('#txd-id, #txt-name, #txt-address').parent().removeClass('invalid');


    if(!(/[A-Za-z .]/.test(address) && address.length > 3)){
        txtAddress.parent().addClass('invalid').trigger('select');
        valid = false;
    }
    if(!/[A-Za-z .]{3,}/.test(name)){
        txtName.parent().addClass('invalid').trigger('select');
        valid = false;
    }
    if(!/^C\d{3}$/.test(id.trim())){
        txtId.parent().addClass('invalid').trigger('select');
        valid = false;
    }

    if(!valid) return;

    if(txtId.attr('disabled')){
        const selectedRow = $("#tbl-customers tbody tr.selected");
        selectedRow.find("td:nth-child(2)").text(name);
        selectedRow.find("td:nth-child(3)").text(address);
        return;
    }

    if(existCustomer(id)){
        alert("Customer already exists");
        txtId.trigger('select');
        return;
    }

    const rowHtml = `
        <tr>
            <td>${id}</td>
            <td>${name}</td>
            <td>${address}</td>
            <td><div class="trash"></div></td> 
        </tr>
    `;

    $('#tbl-customers tbody').append(rowHtml);
    showOrHideTfoot();
    showOrHidePagination();
    initPagination();
    navigateToPage(pages);

    $("#btn-clear").trigger('click');


    $(".trash").off('click').on('click', (eventData) => {
        if(confirm('Are you sure to delete ?')){
            $(eventData.target).parents("tr").fadeOut(500, function(){
                $(this).remove();
                showOrHideTfoot();
                $('#btn-clear').trigger('click');
            });
        }
    });
});

/* Table row selection event listner*/
$('#tbl-customers tbody tr').on('click', 'tr', function() {
    const txtId = $('#txt-id');
    const txtName = $('#txt-name');
    const txtAddress = $('#txt-address');

    const id = $(this).find("td:first-child").text();
    const name = $(this).find("td:nth-child(2)").text();
    const address = $(this).find("td:nth-child(3)").text();

    $('#txt-id').val(id);
    $('#txt-id').attr('disabled', "true");
    $('#txt-name').val(name);
    $('#txt-address').val(address);

    $("#tbl-customers tbody tr").removeClass("selected");
    $(this).addClass('selected');
});

/* Table row deletion event listner */
$("#tbl-customers tbody tr").on('click', '.trash', (eventData) => {
    if(confirm('Are you sure to delete ?')){
        $(eventData.target).parents("tr").fadeOut(500, function(){
            $(this).remove();
            showOrHideTfoot();
            showOrHidePagination();
            $('#btn-clear').trigger('click');
        });
    }
});

/* Clear button event listner */
$('#btn-clear').on('click', ()=> {
    $("#tbl-customers tbody tr.selected").removeClass('selected');
    $('#txt-id').attr('disabled', 'false');
    $('#txt-id').removeAttr('disabled').trigger('focus');
});

/* Other utility  */
function existCustomer(id: string): boolean{
    const ids = $("#tbl-customers tbody tr td:first-child");
    for(let i=0; i< ids.length; i++){
        if($(ids[i]).text() === id){
            return true;
        }
    }
    return false;
}

/* Table footer hide or show */
function showOrHideTfoot(){
    const tfoot = $('#tbl-customers tfoot');
    ($('#tbl-customers tbody tr').length > 0) ? tfoot.hide() : tfoot.show();
}

function showOrHidePagination(){
    const nav = $("nav");
    ($("#tbl-customers tbody tr").length > pageSize)? nav.removeClass("d-none"):nav.addClass("d-none")
}

function calculatePageSize(): number{
    if ($(window).width()! < 992) {
        return 7;
    }

    const tbl = $("#tbl-customers");
    const tFoot = $("#tbl-customers tfoot");
    const rowHtml = `
        <tr class="dummy-data">
            <td>C001</td>
            <td>Manoj</td>
            <td>Dehiwala</td>
            <td><div class="trash"></div></td>
        </tr>
    `;
    const nav = $('nav');
    nav.removeClass('d-none');

    const top = $(window).height()! - ($('footer').height()! + nav.outerHeight(true)!);

    nav.addClass('d-none');
    tFoot.hide();

    tbl.find('tbody tr').hide();

    while (true) {
        tbl.find('tbody').append(rowHtml);
        const bottom = tbl.outerHeight(true)! + tbl.offset()!.top;

        if (bottom >= top) {
            const pageSize = tbl.find("tbody tr.dummy-data").length - 1;

            tbl.find("tbody tr.dummy-data").remove();

            if (tbl.find("tbody tr").length === 0) tFoot.show();
            return pageSize;
        }
    }
}

function initPagination(): void {
    const totalRows = $("#tbl-customers tbody tr").length;
    pages = Math.ceil(totalRows / pageSize);

    let paginationHtml = `
                        <li class="page-item">
                            <a class="page-link" href="#">
                                <i class="fas fa-backward"></i>
                            </a>
                        </li>`;

    for (let i = 0; i < pages; i++) {
        paginationHtml += `<li class="page-item"><a class="page-link" href="#">${i + 1}</a></li>`;
    }

    paginationHtml += `
                        <li class="page-item">
                            <a class="page-link" href="#">
                                <i class="fas fa-forward"></i>
                            </a>
                        </li>
    `;

    $(".pagination").html(paginationHtml);

    $(".page-item:first-child").on('click', function(){
        if ($(this).hasClass("disabled")) return;
        navigateToPage(selectedPage - 1)
    });

    $(".page-item:last-child").on('click', function(){
        if ($(this).hasClass("disabled")) return;
        navigateToPage(selectedPage +1);
    });

    $(".page-item:not(.page-item:first-child, .page-item:last-child)").on('click', function(eventData){
        navigateToPage(+$(this).text());
    } );
}


function navigateToPage(page: number): void {
    $(".pagination .page-item").each((index, elm) => {
        if(+$(elm).text() === page){
            $(elm).addClass("active");
            return false;
        }
    });

    const rows = $("#tbl-customers tbody tr");
    const start = (page -1) * pageSize;

    rows.each((index, elm) => {
        if(index >= start && index <= (start + pageSize)){
            $(elm).show();
        }else{
            $(elm).hide();
        }
    });
}


