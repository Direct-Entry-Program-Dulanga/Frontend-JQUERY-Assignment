import $ from 'jquery';
import '../img/trash.png';

$('#txt-id').trigger('focus');

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


    // $('#txt-id, #txt-name, #txt-address').parent().removeClass('invalid');

    // if(!/^C\d{3}$/.test(id.trim())){
    //     txtId.parent().addClass('invalid').trigger('select');
    //     valid = false;
    // }
    // if(!/[A-Za-z .]{3,}/.test(name)){
    //     txtName.parent().addClass('invalid').trigger('select');
    //     valid = false;
    // }
    // if(!(/[A-Za-z .]/.test(address) && address.length > 3)){
    //     txtAddress.parent().addClass('invalid').trigger('select');
    //     valid = false;
    // }

    // if(!valid) return;

    if(txtId.attr('disabled')){
        const selectedRow = $("#tbl-customers tbody tr.selected");
        selectedRow.find("td:nth-child(2)").text(name);
        selectedRow.find("td:nth-child(3)").text(address);
        return;
    }

    function existCustomer(id: string): boolean{
        let result: boolean = false;
        $("#tbl-customers tbody tr td:first-child").each((index, elm) => {
            if($(elm).text() === id){
                result = true;
            }
        });
        return result;
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

    $("#btn-clear").trigger('click');

    $('#tbl-customers tbody tr').off('click').on('click', function() {
          const id = $(this).find("td:first-child").text();
          const name = $(this).find("td:nth-child(2)").text();
          const address = $(this).find("td:nth-child(3)").text();

          txtId.val(id);
          txtId.attr('disabled', "true");
          txtName.val(name);
          txtAddress.val(address);

          $("#tbl-customers tbody tr").removeClass("selected");
          $(this).addClass('selected');
    });


    $(".trash").off('click').on('click', (eventData) => {
        if(confirm('Are you sure to delete ?')){
            $(eventData.target).parents("tr").fadeOut(500, function(){
                $(this).remove();
                showOrHideTfoot();
            });
        }
    });


});




function showOrHideTfoot(){
    ($('#tbl-customers tbody tr').length > 0)? $('#tbl-customers tfoot').hide(): $('#tbl-customers tfoot').show();
}

$('#btn-clear').on('click', ()=> {
    $("#tbl-customers tbody tr.selected").removeClass('selected');
    $('#txt-id').attr('disabled', 'false');
    $('#txt-id').removeAttr('disabled').trigger('focus');
});