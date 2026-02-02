@props(['url'])
<tr>
<td class="header">
<a href="{{ $url }}" style="display: inline-block;">
@if (trim($slot) === 'Laravel' || trim($slot) === 'EduFit')
    <img src="{{ config('app.url') }}/img/logo.png" class="logo" alt="EduFit Logo" style="height: 50px; max-height: 50px; width: auto;">
@else
    {{ $slot }}
@endif
</a>
</td>
</tr>
