@props(['url'])
<tr>
<td class="header">
<a href="{{ $url }}" style="display: inline-block;">
@if (trim($slot) === 'Laravel' || trim($slot) === 'EduFit')
    @php
        $logoPath = public_path('img/logo.png');
        if (file_exists($logoPath)) {
            $logoData = base64_encode(file_get_contents($logoPath));
            $logoSrc = 'data:image/png;base64,' . $logoData;
        } else {
            $logoSrc = config('app.url') . '/img/logo.png';
        }
    @endphp
    <img src="{{ $logoSrc }}" class="logo" alt="EduFit Logo"  style="height: 100px; max-height: 100px; width: auto;">
    <div style="font-size: 24px; font-weight: bold; color: #333; margin-top: 10px;">
                    EduFit
    </div>
@else
    {{ $slot }}
@endif
</a>
</td>
</tr>
