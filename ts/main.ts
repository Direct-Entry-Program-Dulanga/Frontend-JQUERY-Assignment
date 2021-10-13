import $ from 'jquery';
import '../img/trash.png';

$('#txt-id').trigger('focus');

$('#btn-save').on('click', () => {
    const txtId = $('#txt-id');
    const txtName = $('#txt-name');
    const txtAddress = $('#txt-address');

    const id = (txtId.val() as string).trim();
    const name = (txtName.val() as string).trim();
    const address = (txtAddress.val() as string).trim();

    let valid = true;


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

    $(".trash").off('click');
    $(".trash").on('click', (eventData) => {
        if(confirm('Are you sure to delete ?')){
            $(eventData.target).parents("tr").remove();
        }
    });
});




function showOrHideTfoot(){
    ($('#tbl-customers tbody tr').length > 0)? $('#tbl-customers tfoot').hide(): $('#tbl-customers tfoot').show();
}